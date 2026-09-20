import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

// Execute the application's parser; bundle it so the app's path aliases resolve and the schema
// never has to be duplicated here.
const repoRoot = fileURLToPath(new URL('../../..', import.meta.url));

const bundle = await build({
  entryPoints: [path.join(repoRoot, 'src', 'utils', 'direct-json-import.ts')],
  bundle: true,
  format: 'esm',
  platform: 'neutral',
  target: 'es2022',
  write: false,
  logLevel: 'silent',
  alias: {
    '@utils': path.join(repoRoot, 'src', 'utils'),
    '@app-types': path.join(repoRoot, 'src', 'types'),
  },
});

const code = bundle.outputFiles[0].text;
const { parseTemplateJson } = await import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`);

export function validateTemplateJson(content) {
  return parseTemplateJson(content);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    let content = '';
    for await (const chunk of process.stdin) content += chunk;
    validateTemplateJson(content);
    process.stdout.write('Template import validation passed.\n');
  } catch (error) {
    process.stderr.write(`Template import validation failed: ${error.message}\n`);
    process.exitCode = 1;
  }
}
