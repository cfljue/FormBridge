#!/usr/bin/env node

import { randomUUID } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { validateTemplateJson } from './validate-template.mjs';

function clampNumber(value, fallback, min, max) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.min(max, Math.max(min, parsed)) : fallback;
}

function parseArgs(argv) {
  const options = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--headed' || arg === '--allow-insecure' || arg === '--include-hidden' || arg === '--help') {
      options[arg.slice(2).replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())] = true;
      continue;
    }
    if (!arg.startsWith('--')) throw new Error(`Unexpected argument: ${arg}`);
    const value = argv[i + 1];
    if (!value || value.startsWith('--')) throw new Error(`Missing value for ${arg}`);
    options[arg.slice(2).replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())] = value;
    i += 1;
  }
  return options;
}

function usage() {
  return `Usage:
  node analyze-login-form.mjs --url <http(s)://url> [options]

Options:
  --hint <text>             Optional description used to rank candidates
  --format <name>          Stdout format: formbridge (default), analysis, or all
  --output-dir <path>      Optionally also save both JSON artifacts to this directory
  --wait-for <selector>    Wait for a Playwright selector to become visible
  --observe-ms <number>    Observe and merge dynamic/multi-step states (0-120000)
  --include-hidden         Analyze inactive/hidden login modes already present in the DOM
  --timeout <number>       Navigation/action timeout (1000-120000, default 30000)
  --headed                  Show Chromium so the user can advance a multi-step page
  --allow-insecure         Allow invalid HTTPS certificates for authorized test sites
  --browser-channel <name> Use an installed Playwright channel such as chrome or msedge
  --help                    Show this help
`;
}

function validateUrl(rawUrl) {
  let url;
  try {
    url = new URL(rawUrl);
  } catch {
    throw new Error(`Invalid URL: ${rawUrl}`);
  }
  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new Error('Only http:// and https:// URLs are supported.');
  }
  if (url.username || url.password) {
    throw new Error('Do not put credentials in the URL.');
  }
  return url.toString();
}

async function inspectFrame(frame, hint, observation, includeHidden) {
  const documentAnalysis = await frame.evaluate(({ userHint, analyzeHidden }) => {
    const clean = (value, limit = 160) => String(value ?? '').replace(/\s+/g, ' ').trim().slice(0, limit);
    const attrEscape = (value) => String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    const cssEscape = (value) => globalThis.CSS?.escape
      ? globalThis.CSS.escape(String(value))
      : String(value).replace(/([^a-zA-Z0-9_-])/g, '\\$1');
    const queryCount = (selector) => {
      try { return document.querySelectorAll(selector).length; } catch { return 0; }
    };
    const isUnique = (selector) => queryCount(selector) === 1;
    const isVisible = (element) => {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.display !== 'none'
        && style.visibility !== 'hidden'
        && Number(style.opacity || 1) > 0
        && rect.width > 0
        && rect.height > 0;
    };
    const stableId = (id) => id
      && id.length <= 64
      && !/[0-9a-f]{8}-[0-9a-f-]{20,}/i.test(id)
      && !/^(?:_?aria[_-]auto[_-]id|react-select-|headlessui-|radix-|:r|ember\d|mui-\d)/i.test(id)
      && !/\d{5,}/.test(id);
    const labelText = (element) => {
      const nativeLabels = Array.from(element.labels ?? []).map((label) => clean(label.textContent));
      if (nativeLabels.some(Boolean)) return clean(nativeLabels.filter(Boolean).join(' '));
      const labelledBy = clean(element.getAttribute('aria-labelledby'));
      if (labelledBy) {
        const text = labelledBy.split(/\s+/)
          .map((id) => document.getElementById(id))
          .filter(Boolean)
          .map((node) => clean(node.textContent))
          .filter(Boolean)
          .join(' ');
        if (text) return clean(text);
      }
      return clean(element.closest('label')?.textContent);
    };
    const selectorFor = (element) => {
      const tag = element.tagName.toLowerCase();
      const candidates = [];
      const id = clean(element.getAttribute('id'));
      if (stableId(id)) candidates.push(`#${cssEscape(id)}`);
      for (const attribute of ['data-testid', 'data-test', 'data-qa']) {
        const value = clean(element.getAttribute(attribute));
        if (value) candidates.push(`${tag}[${attribute}="${attrEscape(value)}"]`);
      }
      for (const attribute of ['name', 'autocomplete', 'aria-label']) {
        const value = clean(element.getAttribute(attribute));
        if (value && !(attribute === 'autocomplete' && /^(off|on)$/.test(value))) {
          candidates.push(`${tag}[${attribute}="${attrEscape(value)}"]`);
        }
      }
      for (const selector of candidates) {
        if (isUnique(selector)) return { selector, quality: 'attribute', unique: true };
      }
      candidates.length = 0;
      const stableClasses = Array.from(element.classList).filter((token) =>
        /^[a-zA-Z][a-zA-Z0-9_-]{2,}$/.test(token)
        && !/^(active|disabled|focus|hover|ng-|is-)/i.test(token)
      );
      for (const token of stableClasses) candidates.push(`${tag}.${cssEscape(token)}`);
      for (let ancestor = element.parentElement, depth = 0; ancestor && depth < 6; ancestor = ancestor.parentElement, depth += 1) {
        const ancestorClasses = Array.from(ancestor.classList).filter((token) =>
          /^[a-zA-Z][a-zA-Z0-9_-]{2,}$/.test(token)
          && /login|signin|sign-in|auth|form/i.test(token)
        );
        for (const ancestorClass of ancestorClasses) {
          for (const token of stableClasses) candidates.push(`.${cssEscape(ancestorClass)} .${cssEscape(token)}`);
        }
      }
      const name = clean(element.getAttribute('name'));
      if (name) candidates.push(`${tag}[name="${attrEscape(name)}"]`);
      const autocomplete = clean(element.getAttribute('autocomplete'));
      if (autocomplete && autocomplete !== 'off') {
        candidates.push(`${tag}[autocomplete="${attrEscape(autocomplete)}"]`);
      }
      const ariaLabel = clean(element.getAttribute('aria-label'));
      if (ariaLabel) candidates.push(`${tag}[aria-label="${attrEscape(ariaLabel)}"]`);
      const placeholder = clean(element.getAttribute('placeholder'));
      if (placeholder) candidates.push(`${tag}[placeholder="${attrEscape(placeholder)}"]`);
      const type = clean(element.getAttribute('type')).toLowerCase();
      if (tag === 'input' && type) candidates.push(`input[type="${attrEscape(type)}"]`);
      for (const selector of candidates) {
        if (isUnique(selector)) return { selector, quality: 'heuristic', unique: true };
      }

      const parts = [];
      let current = element;
      for (let depth = 0; current?.parentElement && depth < 6; depth += 1) {
        const currentTag = current.tagName.toLowerCase();
        const siblings = Array.from(current.parentElement.children).filter((node) => node.tagName === current.tagName);
        const suffix = siblings.length > 1 ? `:nth-of-type(${siblings.indexOf(current) + 1})` : '';
        parts.unshift(`${currentTag}${suffix}`);
        const selector = parts.join(' > ');
        if (isUnique(selector)) return { selector, quality: 'structural', unique: true };
        current = current.parentElement;
      }
      return { selector: parts.join(' > '), quality: 'structural', unique: isUnique(parts.join(' > ')) };
    };
    const inferRole = (element, label) => {
      const type = clean(element.getAttribute('type')).toLowerCase();
      const autocomplete = clean(element.getAttribute('autocomplete')).toLowerCase();
      const descriptor = [
        element.getAttribute('name'),
        element.getAttribute('id'),
        element.getAttribute('placeholder'),
        element.getAttribute('aria-label'),
        label,
        autocomplete,
      ].map((value) => clean(value).toLowerCase()).join(' ');
      const identityDescriptor = [
        element.getAttribute('name'),
        element.getAttribute('id'),
        autocomplete,
      ].map((value) => clean(value).toLowerCase()).join(' ');
      if (type === 'password' || /current-password|new-password/.test(autocomplete)) return 'password';
      if (/one-time-code/.test(autocomplete) || /\b(otp|totp|mfa)\b/.test(descriptor)) return 'one-time-code';
      if (/captcha|verification|verify.?code|验证码|校验码|图形码/.test(descriptor)) return 'verification-code';
      if (/\b(user(name)?|user.?account|account|login|member|identifier)\b|用户名|账号|帐号|工号/.test(identityDescriptor)) return 'username';
      if (type === 'email' || autocomplete === 'email' || /e-?mail|邮箱/.test(descriptor)) return 'email';
      if (type === 'tel' || /\b(phone|mobile|tel)\b|手机|手机号|电话/.test(descriptor)) return 'phone';
      if (type === 'checkbox' && /remember|keep.*sign|记住|保持登录/.test(descriptor)) return 'remember-me';
      if (/\b(user(name)?|account|login|member|identifier)\b|用户|用户名|账号|帐号|工号/.test(descriptor)) return 'username';
      return 'field';
    };
    const isLikelyDecoy = (element) => {
      if (isVisible(element)) return false;
      const name = clean(element.getAttribute('name')).toLowerCase();
      if (/^hide(name|pass|user|password)/.test(name)) return true;
      for (let current = element, depth = 0; current && depth < 5; current = current.parentElement, depth += 1) {
        const marker = `${clean(current.className)} ${clean(current.id)}`;
        if (/honeypot|decoy|hideinput|hidden-(user|pass)|hwid-mask/i.test(marker)) return true;
      }
      return false;
    };
    const fieldMetadata = (element) => {
      const label = labelText(element);
      const selector = selectorFor(element);
      return {
        role: inferRole(element, label),
        tag: element.tagName.toLowerCase(),
        type: clean(element.getAttribute('type') || element.tagName.toLowerCase()).toLowerCase(),
        name: clean(element.getAttribute('name')),
        label,
        placeholder: clean(element.getAttribute('placeholder')),
        ariaLabel: clean(element.getAttribute('aria-label')),
        autocomplete: clean(element.getAttribute('autocomplete')),
        required: element.matches(':required') || element.getAttribute('aria-required') === 'true',
        visible: isVisible(element),
        selector: selector.selector,
        selectorQuality: selector.quality,
        selectorUnique: selector.unique,
      };
    };
    const excludedTypes = new Set(['hidden', 'submit', 'button', 'reset', 'image', 'file']);
    const editableFields = Array.from(document.querySelectorAll('input, textarea, select'))
      .filter((element) => !element.disabled)
      .filter((element) => !excludedTypes.has(clean(element.getAttribute('type')).toLowerCase()))
      .filter((element) => !isLikelyDecoy(element))
      .filter((element) => analyzeHidden || isVisible(element));
    const buttonName = (element) => clean(element.getAttribute('aria-label')
      || element.getAttribute('title') || (element.tagName === 'INPUT' ? '' : element.textContent));
    const findButton = (root, form) => {
      const buttons = [...new Set([
        ...root.querySelectorAll('button, input[type="submit"], input[type="button"], [role="button"], [class*="btn"], [class*="button"]'),
        ...Array.from(form?.elements ?? []).filter((element) => element.matches('button, input[type="submit"], input[type="button"]')),
      ])].filter((element) => !element.disabled && element.getAttribute('aria-disabled') !== 'true'
        && (!form || !element.form || element.form === form)
        && !element.matches('[type="reset"]')
        && (analyzeHidden || isVisible(element)));
      const loginPattern = /sign.?in|log.?in|continue|next|submit|登录|登陆|下一步|继续|确定|验证/i;
      const depthOf = (element) => { let depth = 0; for (let current = element; current; current = current.parentElement) depth += 1; return depth; };
      const priorityOf = (element) => {
        if (element.matches('button, input[type="submit"]')) return 0;
        if (element.getAttribute('role') === 'button') return 1;
        if (/btn-primary|normalbtn|(^|\s)[\w-]*btn(\s|$)/i.test(element.className)) return 2;
        return 3;
      };
      const button = buttons
        .filter((element) => !/cancel|reset|log.?out|sign.?out|取消|重置|退出/i.test(buttonName(element)))
        .filter((element) => (element.form && element.type === 'submit') || loginPattern.test(buttonName(element)))
        .sort((a, b) => priorityOf(a) - priorityOf(b) || depthOf(b) - depthOf(a));
      if (!button.length) return { button: null, buttonWarning: 'No identifiable login button; submit manually.' };
      const best = button.filter((element) => priorityOf(element) === priorityOf(button[0]));
      if (best.length > 1) return { button: null, buttonWarning: 'Multiple possible login buttons; automatic clicking omitted. Review the target button.' };
      const selected = best[0];
      const selector = selectorFor(selected);
      if (!selector.unique) return { button: null, buttonWarning: 'Login button selector is not unique; submit manually.' };
      return { button: { name: buttonName(selected) || 'Submit', selector: selector.selector, selectorQuality: selector.quality, selectorUnique: true } };
    };
    const candidateFor = (root, kind, index) => {
      const elements = kind === 'form'
        ? editableFields.filter((element) => element.closest('form') === root)
        : editableFields.filter((element) => !element.closest('form'));
      if (elements.length === 0) return null;
      const fields = elements.map(fieldMetadata);
      let actionRoot = root;
      if (kind === 'form') {
        for (let current = root.parentElement; current && current !== document.body; current = current.parentElement) {
          const marker = `${clean(current.id)} ${clean(current.className)}`;
          if (/login|sign.?in|auth/i.test(marker)) { actionRoot = current; break; }
        }
      }
      const { button, buttonWarning } = findButton(actionRoot, kind === 'form' ? root : null);
      const roles = new Set(fields.map((field) => field.role));
      let score = 0;
      if (roles.has('password')) score += 60;
      if (roles.has('username')) score += 35;
      if (roles.has('email')) score += 32;
      if (roles.has('phone')) score += 25;
      if (roles.has('one-time-code') || roles.has('verification-code')) score += 24;
      if (roles.has('remember-me')) score += 4;
      if (kind === 'form') score += 5;
      if (button) score += 15;
      if (fields.every((field) => !field.visible)) score -= 8;
      const searchable = clean([
        ...fields.flatMap((field) => [field.name, field.label, field.placeholder, field.ariaLabel, field.role]),
        button?.name,
        root.getAttribute?.('aria-label'),
      ].filter(Boolean).join(' '), 1000).toLowerCase();
      const loginPattern = /sign.?in|log.?in|auth|account|password|登录|登陆|认证|账号|帐号|密码/i;
      if (loginPattern.test(searchable)) score += 15;
      const hint = clean(userHint, 300).toLowerCase();
      const targetMatch = hint.match(/(?:extract|select|target|focus|analy[sz]e|提取|取出|选择|目标|需要|分析|获取|帮我).{0,40}/i);
      const targetHint = targetMatch?.[0] ?? hint;
      const hintTokens = hint.split(/[\s,，。;；:：/]+/).filter((token) => token.length >= 2);
      const matchedHintTokens = hintTokens.filter((token) => searchable.includes(token));
      score += Math.min(20, matchedHintTokens.length * 5);
      const semanticMatches = [];
      if (/password|密码/i.test(targetHint) && roles.has('password')) semanticMatches.push('password');
      if (/phone|mobile|手机号|手机登录/i.test(targetHint) && roles.has('phone')) semanticMatches.push('phone');
      if (/sms|短信|验证码/i.test(targetHint) && (roles.has('verification-code') || roles.has('one-time-code'))) semanticMatches.push('verification-code');
      if (/account|user(name)?|账号|帐号|用户名/i.test(targetHint) && (roles.has('username') || roles.has('email'))) semanticMatches.push('username');
      score += Math.min(30, semanticMatches.length * 20);
      return {
        id: `${kind}-${index + 1}`,
        kind,
        score,
        matchedHintTokens: [...new Set([...matchedHintTokens, ...semanticMatches])],
        fields,
        button,
        buttonWarning,
      };
    };

    const forms = Array.from(document.querySelectorAll('form'));
    const candidates = forms.map((form, index) => candidateFor(form, 'form', index)).filter(Boolean);
    if (editableFields.some((element) => !element.closest('form'))) {
      const virtual = candidateFor(document, 'virtual-form', 0);
      if (virtual) candidates.push(virtual);
    }
    return { title: clean(document.title), candidates };
  }, { userHint: hint ?? '', analyzeHidden: Boolean(includeHidden) });

  return documentAnalysis.candidates.map((candidate) => ({
    ...candidate,
    observation,
    mainFrame: frame === frame.page().mainFrame(),
    frameUrl: frame.url(),
    frameName: frame.name(),
    pageTitle: documentAnalysis.title,
  }));
}

async function collectCandidates(page, hint, observation, includeHidden) {
  const candidates = [];
  const warnings = [];
  for (const frame of page.frames()) {
    try {
      candidates.push(...await inspectFrame(frame, hint, observation, includeHidden));
    } catch (error) {
      warnings.push(`Could not inspect frame ${frame.url() || '(about:blank)'}: ${error.message}`);
    }
  }
  return { candidates, warnings };
}

function deduplicateCandidates(candidates) {
  const bySignature = new Map();
  for (const candidate of candidates) {
    const signature = JSON.stringify({
      mainFrame: candidate.mainFrame,
      frameUrl: candidate.frameUrl,
      fields: candidate.fields.map((field) => field.selector).sort(),
      button: candidate.button?.selector ?? '',
    });
    const previous = bySignature.get(signature);
    if (!previous || candidate.score > previous.score) bySignature.set(signature, candidate);
  }
  return [...bySignature.values()].sort((a, b) => {
    const aRank = a.score + (a.kind === 'form' ? 40 : 0);
    const bRank = b.score + (b.kind === 'form' ? 40 : 0);
    return bRank - aRank;
  });
}

function fieldDisplayName(field, usedNames) {
  const base = field.role === 'field'
    ? field.label || field.name || field.placeholder || 'field'
    : field.role;
  const normalized = String(base).trim().slice(0, 80) || 'field';
  const count = (usedNames.get(normalized) ?? 0) + 1;
  usedNames.set(normalized, count);
  return count === 1 ? normalized : `${normalized}-${count}`;
}

function createFormBridgeTemplate(candidates, finalUrl, title) {
  const eligible = candidates.filter((candidate) => candidate.mainFrame && candidate.score >= 25);
  if (eligible.length === 0) return [];
  const formEligible = eligible.filter((candidate) => candidate.kind === 'form');
  const primary = formEligible[0] ?? eligible[0];
  const bestByObservation = new Map();
  for (const candidate of formEligible.length > 0 ? formEligible : eligible) {
    if (!bestByObservation.has(candidate.observation)) {
      bestByObservation.set(candidate.observation, candidate);
    }
  }
  const relevant = [...bestByObservation.values()].filter((candidate) => {
    try { return new URL(candidate.frameUrl).origin === new URL(primary.frameUrl).origin; } catch { return false; }
  });
  const fieldsBySelector = new Map();
  for (const candidate of relevant) {
    for (const field of candidate.fields) {
      if (!fieldsBySelector.has(field.selector)) fieldsBySelector.set(field.selector, field);
    }
  }
  if ([...fieldsBySelector.values()].some((field) => !field.selectorUnique)) return [];
  const usedNames = new Map();
  const fields = [...fieldsBySelector.values()].map((field) => ({
    id: randomUUID(),
    name: fieldDisplayName(field, usedNames),
    selector: field.selector,
    ...(field.role === 'password' ? { inputType: 'password' } : {}),
  }));
  const now = Date.now();
  const parsed = new URL(finalUrl);
  return [{
    id: randomUUID(),
    name: `${title || parsed.hostname} login`,
    description: `Generated by extract-login-form from ${finalUrl}. Review selectors before use.`,
    url: finalUrl,
    fields,
    button: primary.button ? { name: primary.button.name, selector: primary.button.selector } : undefined,
    createdAt: now,
    updatedAt: now,
  }];
}

export async function analyzeLoginForm(rawOptions) {
  const url = validateUrl(rawOptions.url);
  const timeout = clampNumber(rawOptions.timeout, 30000, 1000, 120000);
  const observeMs = clampNumber(rawOptions.observeMs, 0, 0, 120000);
  const launchOptions = { headless: !rawOptions.headed };
  if (rawOptions.browserChannel) launchOptions.channel = rawOptions.browserChannel;

  let browser;
  try {
    browser = await chromium.launch(launchOptions);
  } catch (error) {
    if (/Executable doesn't exist|browser.*not found|Please run/i.test(error.message)) {
      throw new Error(`${error.message}\nInstall the browser with: npx playwright install chromium`);
    }
    throw error;
  }

  try {
    const context = await browser.newContext({
      ignoreHTTPSErrors: Boolean(rawOptions.allowInsecure),
      viewport: { width: 1365, height: 900 },
    });
    const page = await context.newPage();
    page.setDefaultTimeout(timeout);
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout });
    if (rawOptions.waitFor) {
      await page.locator(rawOptions.waitFor).first().waitFor({ state: 'visible', timeout });
    } else {
      await page.waitForTimeout(500);
    }

    const collected = [];
    const warnings = [];
    let observations = 0;
    const started = Date.now();
    do {
      const snapshot = await collectCandidates(page, rawOptions.hint, observations, rawOptions.includeHidden);
      collected.push(...snapshot.candidates);
      warnings.push(...snapshot.warnings);
      observations += 1;
      const remaining = observeMs - (Date.now() - started);
      if (remaining > 0) await page.waitForTimeout(Math.min(1000, remaining));
    } while (Date.now() - started < observeMs);

    const candidates = deduplicateCandidates(collected);
    if (candidates.length === 0) warnings.push('No editable form fields were found. Try --wait-for, --headed, --observe-ms, or --include-hidden.');
    if (candidates.filter((candidate) => candidate.score >= 25).length > 1) {
      warnings.push('Multiple login-like candidates were found. Review scores, labels, and frame URLs before importing.');
    }
    if (candidates.some((candidate) => !candidate.mainFrame && candidate.score >= 25)) {
      warnings.push('A login-like form exists inside an iframe. FormBridge currently fills the top document only; iframe-only selectors are analysis-only.');
    }

    const finalUrl = page.url();
    const title = await page.title();
    const templates = createFormBridgeTemplate(candidates, finalUrl, title);
    for (const candidate of candidates) {
      if (candidate.buttonWarning) warnings.push(candidate.buttonWarning);
      if (candidate.fields.some((field) => !field.selectorUnique)) warnings.push('A field selector is not unique; affected templates cannot be imported safely.');
      if ([...candidate.fields, candidate.button].filter(Boolean).some((field) => field.selectorQuality !== 'attribute')) {
        warnings.push('Some selectors use classes, text attributes, or DOM structure. Uniqueness is verified only in this observation; review stability before reuse.');
      }
    }
    if (new URL(finalUrl).search || new URL(finalUrl).hash) warnings.push('Navigation query/hash preserved. FormBridge uses the same URL for navigation and substring matching; changed query order or parameters may require adjusting the record URL.');
    if (templates.length) validateTemplateJson(JSON.stringify(templates));
    const analysis = {
      analysisVersion: 1,
      source: {
        requestedUrl: url,
        finalUrl,
        title,
        hint: rawOptions.hint ?? '',
        analyzedAt: new Date().toISOString(),
      },
      observations,
      candidates,
      templateValidation: templates.length ? 'passed' : 'not-applicable',
      warnings: [...new Set(warnings)],
      privacy: {
        inputValuesRead: false,
        cookiesRead: false,
        browserStorageRead: false,
        screenshotsCaptured: false,
        formsSubmitted: false,
      },
    };
    return { analysis, templates };
  } finally {
    await browser.close();
  }
}

export function formatOutput(result, format = 'formbridge') {
  if (format === 'formbridge') return result.templates;
  if (format === 'analysis') return result.analysis;
  if (format === 'all') return result;
  throw new Error('--format must be formbridge, analysis, or all.');
}

export async function writeArtifacts(result, outputDir) {
  const resolved = path.resolve(outputDir);
  await mkdir(resolved, { recursive: true });
  const analysisPath = path.join(resolved, 'login-form.analysis.json');
  const templatePath = path.join(resolved, 'login-form.formbridge.json');
  await Promise.all([
    writeFile(analysisPath, `${JSON.stringify(result.analysis, null, 2)}\n`, 'utf8'),
    writeFile(templatePath, `${JSON.stringify(result.templates, null, 2)}\n`, 'utf8'),
  ]);
  return { analysisPath, templatePath };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    process.stdout.write(usage());
    return;
  }
  if (!args.url) throw new Error('--url is required.');
  const format = args.format ?? 'formbridge';
  if (!['formbridge', 'analysis', 'all'].includes(format)) {
    throw new Error('--format must be formbridge, analysis, or all.');
  }
  const result = await analyzeLoginForm(args);
  if (args.outputDir) await writeArtifacts(result, args.outputDir);
  process.stdout.write(`${JSON.stringify(formatOutput(result, format), null, 2)}\n`);
}

const isDirectRun = process.argv[1]
  && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));

if (isDirectRun) {
  main().catch((error) => {
    process.stderr.write(`extract-login-form: ${error.message}\n`);
    process.exitCode = 1;
  });
}
