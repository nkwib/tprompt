'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const distDir = path.join(__dirname, '..', '..', 'dist');
const indexCjs = path.join(distDir, 'index.cjs');
const singleBraceCjs = path.join(distDir, 'single-brace.cjs');

if (!fs.existsSync(indexCjs) || !fs.existsSync(singleBraceCjs)) {
  console.error(`CJS smoke test: dist/ artefacts missing under ${distDir}.`);
  console.error('Run `pnpm build` before `pnpm test:cjs`.');
  process.exit(1);
}

const { prompt, makePromptTag } = require(indexCjs);
const { prompt: sb } = require(singleBraceCjs);

assert.equal(typeof prompt, 'function', 'default prompt should be a function');
assert.equal(typeof makePromptTag, 'function', 'makePromptTag should be exported');
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

console.log('CJS smoke test passed');
process.exit(0);
