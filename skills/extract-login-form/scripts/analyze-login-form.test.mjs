import assert from 'node:assert/strict';
import { createServer } from 'node:http';

import { analyzeLoginForm as analyze, formatOutput } from './analyze-login-form.mjs';
import { validateTemplateJson } from './validate-template.mjs';
const analyzeLoginForm = (options) => analyze({ browserChannel: process.env.PLAYWRIGHT_BROWSER_CHANNEL, ...options });

const html = `<!doctype html>
<html lang="en">
  <head><title>Employee Portal</title></head>
  <body>
    <main>
      <form id="employee-login" aria-label="Employee sign in">
        <label for="employee-email">Work email</label>
        <input id="employee-email" name="email" type="email" autocomplete="username" value="sensitive@example.com" required>
        <label for="employee-password">Password</label>
        <input id="employee-password" name="password" type="password" autocomplete="current-password" value="super-secret" required>
        <label><input name="remember" type="checkbox"> Remember me</label>
        <button id="sign-in" type="submit">Sign in</button>
      </form>
    </main>
  </body>
</html>`;

const multiStepHtml = `<!doctype html>
<html lang="en">
  <head><title>Multi-step Login</title></head>
  <body>
    <main id="step">
      <form><label for="user">Account</label><input id="user" name="username" autocomplete="username"><button type="submit">Next</button></form>
    </main>
    <script>
      setTimeout(() => {
        document.querySelector('#step').innerHTML = '<form><label for="pass">Password</label><input id="pass" name="password" type="password" autocomplete="current-password"><button type="submit">Sign in</button></form>';
      }, 600);
    </script>
  </body>
</html>`;

const modeSwitchHtml = `<!doctype html>
<html lang="en">
  <head><title>Login Modes</title></head>
  <body>
    <section id="sms-mode">
      <form><input id="mobile" name="mobile" type="tel" placeholder="手机号"><input id="sms" placeholder="短信验证码"><button type="submit">手机号登录</button></form>
    </section>
    <section id="password-mode" style="display:none">
      <div class="password-login-root">
        <form><div class="decoy-mask"><input name="hideName"><input name="hidePass" type="password"></div><input id="account" name="account" placeholder="账号"><input id="password" type="password" placeholder="密码"></form>
        <div id="password-submit" class="btn-primary">密码登录</div>
      </div>
    </section>
  </body>
</html>`;

const fixtures = {
  '/plain': '<form><input name="user"><input type="password" name="password"><button>→</button></form>',
  '/dynamic': '<form><input id="_aria_auto_id_0" class="large" name="username"><input id="react-select-3-input" name="password" type="password"><button type="submit">登录</button></form>',
  '/ambiguous': '<form><input name="username"><input type="password"><button>Sign in</button><button>Continue</button></form>',
  '/input-submit': '<form><input name="username"><input type="password"><input type="submit" value="sensitive-button-value"></form>',
  '/outside': '<form id="auth"><input name="username"><input type="password"></form><button form="auth">→</button>',
  '/non-login': '<form><input name="username"><input type="password"><button type="reset">Reset</button><button type="button">Show password</button></form>',
  '/iframe': '<iframe src="/plain"></iframe>',
};
let submissions = 0;
const server = createServer((request, response) => {
  if (request.method !== 'GET') submissions += 1;
  const pathname = new URL(request.url, 'http://localhost').pathname;
  response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
  response.end(fixtures[pathname] ?? (pathname === '/multi' ? multiStepHtml : pathname === '/modes' ? modeSwitchHtml : html));
});

await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const address = server.address();

try {
  const result = await analyzeLoginForm({
    url: `http://127.0.0.1:${address.port}/login`,
    hint: 'employee login',
    timeout: 10000,
  });
  assert.equal(result.templates.length, 1);
  assert.equal(result.analysis.privacy.inputValuesRead, false);
  assert.ok(result.analysis.candidates[0].score >= 100);
  assert.deepEqual(
    result.templates[0].fields.map((field) => field.selector),
    ['#employee-email', '#employee-password', 'input[name="remember"]']
  );
  assert.equal(result.templates[0].button.selector, '#sign-in');
  assert.equal(result.templates[0].fields.find((field) => field.selector === '#employee-password').inputType, 'password');
  assert.deepEqual(formatOutput(result), result.templates);
  assert.deepEqual(formatOutput(result, 'analysis'), result.analysis);
  assert.deepEqual(formatOutput(result, 'all'), result);
  assert.throws(() => formatOutput(result, 'xml'), /formbridge, analysis, or all/);
  const serialized = JSON.stringify(result);
  assert.equal(serialized.includes('sensitive@example.com'), false);
  assert.equal(serialized.includes('super-secret'), false);

  const multiStepResult = await analyzeLoginForm({
    url: `http://127.0.0.1:${address.port}/multi`,
    observeMs: 1400,
    timeout: 10000,
  });
  assert.deepEqual(
    multiStepResult.templates[0].fields.map((field) => field.selector).sort(),
    ['#pass', '#user']
  );
  assert.ok(multiStepResult.analysis.observations >= 2);

  const hiddenModeResult = await analyzeLoginForm({
    url: `http://127.0.0.1:${address.port}/modes`,
    hint: '密码登录',
    includeHidden: true,
    timeout: 10000,
  });
  assert.deepEqual(
    hiddenModeResult.templates[0].fields.map((field) => field.selector),
    ['#account', '#password']
  );
  assert.equal(hiddenModeResult.templates[0].button.selector, '#password-submit');
  assert.equal(JSON.stringify(hiddenModeResult).includes('hideName'), false);
  const base = `http://127.0.0.1:${address.port}`;
  const plain = await analyzeLoginForm({ url: `${base}/plain?action=redirect&label=s3#login` });
  assert.equal(plain.templates[0].url, `${base}/plain?action=redirect&label=s3#login`);
  assert.ok(plain.templates[0].button);
  assert.equal(plain.analysis.templateValidation, 'passed');
  validateTemplateJson(JSON.stringify(plain.templates));
  assert.throws(() => validateTemplateJson('{"name":"Wrong data format","values":[]}'), /fields/);
  assert.throws(() => validateTemplateJson('```json\n{}\n```'));
  assert.throws(() => validateTemplateJson(JSON.stringify([...plain.templates, ...plain.templates])), /exactly one/);
  const dynamic = await analyzeLoginForm({ url: `${base}/dynamic` });
  assert.deepEqual(dynamic.templates[0].fields.map((field) => field.selector), ['input[name="username"]', 'input[name="password"]']);
  assert.ok(dynamic.analysis.candidates[0].fields.every((field) => field.selectorUnique && field.selectorQuality === 'attribute'));
  const ambiguous = await analyzeLoginForm({ url: `${base}/ambiguous` });
  assert.equal(ambiguous.templates[0].button, undefined);
  assert.ok(ambiguous.analysis.warnings.some((warning) => warning.includes('Multiple possible login buttons')));
  const inputSubmit = await analyzeLoginForm({ url: `${base}/input-submit` });
  assert.ok(inputSubmit.templates[0].button);
  assert.equal(JSON.stringify(inputSubmit).includes('sensitive-button-value'), false);
  const outside = await analyzeLoginForm({ url: `${base}/outside` });
  assert.ok(outside.templates[0].button);
  const nonLogin = await analyzeLoginForm({ url: `${base}/non-login` });
  assert.equal(nonLogin.templates[0].button, undefined);
  assert.ok(nonLogin.analysis.warnings.some((warning) => warning.includes('submit manually')));
  const iframe = await analyzeLoginForm({ url: `${base}/iframe` });
  assert.deepEqual(iframe.templates, []);
  assert.ok(iframe.analysis.warnings.some((warning) => warning.includes('iframe')));
  assert.equal(submissions, 0);
  process.stdout.write('extract-login-form test passed\n');
} finally {
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
}
