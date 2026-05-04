import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

const __dirname = dirname(fileURLToPath(import.meta.url));
const cliPath = join(__dirname, '..', '..', 'dist', 'cli.cjs');

describe.skipIf(!existsSync(cliPath))('promptkit init CLI', () => {
  let workDir: string;
  beforeEach(() => {
    workDir = mkdtempSync(join(tmpdir(), 'promptkit-cli-'));
  });
  afterEach(() => {
    rmSync(workDir, { recursive: true, force: true });
  });

  it('creates prompts/example.ts with the typed example', () => {
    const stdout = execFileSync('node', [cliPath, 'init'], {
      cwd: workDir,
      encoding: 'utf8'
    });
    const example = readFileSync(join(workDir, 'prompts', 'example.ts'), 'utf8');
    expect(example).toContain("import { prompt } from 'promptkit';");
    expect(example).toContain("prompt('Hello, {{name}}!')");
    expect(example).toContain('.with({ name:');
    expect(stdout).toContain('created');
    expect(stdout).toContain('Playground');
  });

  it('refuses to overwrite an existing example file', () => {
    execFileSync('node', [cliPath, 'init'], { cwd: workDir });
    expect(() =>
      execFileSync('node', [cliPath, 'init'], { cwd: workDir, encoding: 'utf8' })
    ).toThrow();
  });

  it('prints usage and exits non-zero on unknown command', () => {
    expect(() =>
      execFileSync('node', [cliPath, 'whatever'], {
        cwd: workDir,
        encoding: 'utf8'
      })
    ).toThrow();
  });

  it('starts with a #!/usr/bin/env node shebang', () => {
    const cliSource = readFileSync(cliPath, 'utf8');
    expect(cliSource.startsWith('#!/usr/bin/env node')).toBe(true);
  });
});
