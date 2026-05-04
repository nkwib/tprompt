import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseArgs } from 'node:util';

export const PLAYGROUND_URL_PLACEHOLDER = '// TODO(010): fill TS Playground URL';

export const EXAMPLE_TEMPLATE = `import { prompt } from 'promptkit';

// promptkit catches placeholder typos at \`tsc\` time, before the model.
const greet = prompt('Hello, {{name}}!');

// Try renaming \`name\` above to \`nme\` — TypeScript will flag the .with()
// call below as missing a property, before the program runs.
console.log(greet.with({ name: 'world' }));
`;

export interface InitResult {
  readonly created: string;
}

export function runInit(cwd: string = process.cwd()): InitResult {
  const promptsDir = join(cwd, 'prompts');
  if (!existsSync(promptsDir)) {
    mkdirSync(promptsDir, { recursive: true });
  }
  const file = join(promptsDir, 'example.ts');
  if (existsSync(file)) {
    throw new Error(`refusing to overwrite ${file}`);
  }
  writeFileSync(file, EXAMPLE_TEMPLATE, 'utf8');
  return { created: file };
}

function printUsage(): void {
  process.stderr.write('promptkit <command>\n');
  process.stderr.write('\n');
  process.stderr.write('Commands:\n');
  process.stderr.write('  init    Scaffold a prompts/ directory with a typed example\n');
}

export function main(argv: readonly string[]): number {
  const { positionals } = parseArgs({
    allowPositionals: true,
    strict: false,
    args: [...argv]
  });
  const sub = positionals[0];
  if (sub === 'init') {
    try {
      const { created } = runInit();
      process.stdout.write(`created ${created}\n`);
      process.stdout.write('see the typed surface in the Playground:\n');
      process.stdout.write(`  ${PLAYGROUND_URL_PLACEHOLDER}\n`);
      return 0;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      process.stderr.write(`${message}\n`);
      return 1;
    }
  }
  if (sub === undefined) {
    printUsage();
    return 1;
  }
  process.stderr.write(`unknown command: ${sub}\n`);
  printUsage();
  return 1;
}

const argv1 = process.argv[1] ?? '';
if (argv1.endsWith('cli.cjs') || argv1.endsWith('cli.js')) {
  process.exit(main(process.argv.slice(2)));
}
