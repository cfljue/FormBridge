import assert from 'node:assert/strict';
import { createServer } from 'node:http';

import { analyzeLoginForm, formatOutput } from './analyze-login-form.mjs';

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

const server = createServer((request, response) => {
  response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
  response.end(request.url === '/multi' ? multiStepHtml : request.url === '/modes' ? modeSwitchHtml : html);
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
  process.stdout.write('extract-login-form test passed\n');
} finally {
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
}
