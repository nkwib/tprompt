// ESM mirror of test.cjs: exercises the built ESM dist entry points the way a
// consumer would via `import`, complementing the CJS `require` smoke test.
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const distDir = join(here, '..', '..', 'dist');
const indexJs = join(distDir, 'index.js');
const singleBraceJs = join(distDir, 'single-brace.js');

if (!existsSync(indexJs) || !existsSync(singleBraceJs)) {
  console.error(`ESM smoke test: dist/ artefacts missing under ${distDir}.`);
  console.error('Run `pnpm build` before `pnpm test:esm`.');
  process.exit(1);
}

const { prompt, makePromptTag, MissingPlaceholderError } = await import(indexJs);
const { prompt: sb } = await import(singleBraceJs);

assert.equal(typeof prompt, 'function', 'default prompt should be a function');
assert.equal(typeof makePromptTag, 'function', 'makePromptTag should be exported');
assert.equal(
  typeof MissingPlaceholderError,
  'function',
  'MissingPlaceholderError should be exported'
);
assert.equal(typeof sb, 'function', 'single-brace prompt should be a function');

assert.equal(
  prompt('Hi {{name}}').with({ name: 'a' }),
  'Hi a',
  'default {{name}} substitution'
);

assert.equal(
  sb('Hi {name}').with({ name: 'b' }),
  'Hi b',
  'single-brace {name} substitution'
);

assert.equal(
  prompt('{{a}} {{b}}').partial({ a: 'A' }).with({ b: 'B' }),
  'A B',
  '.partial then .with'
);

const angle = makePromptTag({ open: '<<', close: '>>' });
assert.equal(
  angle('<<x>>').with({ x: 'X' }),
  'X',
  'factory with custom delimiter'
);

// Missing-key guard (default onMissing: 'throw').
const cast = /** @type {(v: Record<string, unknown>) => string} */ (
  prompt('Hi {{name}}').with
);
assert.throws(
  () => cast({}),
  MissingPlaceholderError,
  'absent placeholder key should throw MissingPlaceholderError'
);

console.log('ESM smoke test passed');
process.exit(0);
