import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseArgs } from 'node:util';

export const PLAYGROUND_URL =
  'https://www.typescriptlang.org/play/#code/PTAEBcAcCcHsFtLggT0gUwLSwHYBsVQBncAVwCNQAzWaUAFQGVQAFPAQxQHM5ScATAHQAoEKACSOUO1DR07PKBiwAVugDGyFLFKgA7jrz990AJbh0oAAanEtZAG8lcRMgC+1F6ADkUF0m8rUEAUAlEwcAALUyJiMkpo0FN8JPRjCPQ5YlgIdNYObl4BUDwkgGt9WlKYvXMInWQcSHgRYXA0SwAZdHALOgBeYVBQAB8fdm8Rn3IJ0e91GZ9+Be90ZaplrmWI5dNllW9Bye9S5bxl+GWcZdhlyGWAR2XoZaJl8AOh2dJlgDdlvWWAA9lihlgAvD5HACCywAQssAMLLAAiywAossAGLLADiywAEstxMsAFKQ2YAaWWHWWAFllgA5ZYAeWWLGWAEVlgAlZaMZb0ck+ACqywAassAOrLAAaywAmssAFrLAD63gA3K12hJ+AiIux+qAuj0MkcAAzeYbeACMVu8ACZ7QBme0AFntAFZ7QA2e0AdntAA57QBOTXajC6+jsUx4AA8zHQgIsAhiJDMOC4AD5QAMhkmU+g0z4JgB+CDQUjoQ4ALlAhdT-BiVgAJA5xHqDdA3O2klQzdy3EEK52Y3H49zc-WqAoiOgtW0o+IiJ3E6Bk030+BMzm84dG8Xm9Z2yber2HP3B8PQKP+OOE1PQDO5wvI5Y0SnoOxNGwf+g6iMDIiHXTcj23XcABpQChdR1A3IsSwzJIuDzUAcHQH4MlzfMGwQrcTwcZCszcBwHD7HABzoMU3FoiiqNAbl0BIYdDiGUdV34eMxVzMCSx3as2KGW9QE-Hcf3AP91AA2AgOgECmJIaDYPg0YeKEoZ6zE79fw4aTAP4YDJ2Y8BlLg7MhPrFTFx1MVDVMdhyDwZjmSoeMWHw8DYl3HDDgAbRYABdTySz8jCsOgYKKyY9RaC44iuGg8LsOfUAnDkdh+FwAhQD8ilEikIL6wS0A3C1JJelnaTQARBBIDjVJQMQ48EtzBxDhqSIAAofkNIh6zssxHOcohXPjbSJKkmS5JAxhs2zABKYqdxQrU3GEQz1A4TIqD4TRTFwZw6vAeNYpwEg8L4lqVqzbMuosRAOAsetGCWmq6oari5q1MJQEAAFIAcBoHgZB0GwfBiHIcB376FyPRUi4dB6zkHB2HgSwyNIIhoAZNH0FoiBskx+ccbxgnyHQPBYD0QnQC2+Q6EiSwMjgaARDEKHOa57nueEYQzounh0G6NDlFcLrDm8fFKap6DidJ9HaIAQlAeUdDoSAOCkBIyM19gcHoUwMgJrqqfUBQkbShwzYt2iFsEA4Fp+oXukETqIi69qhixjJcfR+tvAUUxpO8aCxEABMJWDgDBoDaHwsYV1ZEhieBoiIFCCtQDBoO8H3E4mLLmPQ2BkGTaJwEOPWDaN6AA+UUPDht5yA+LTBhX5YQ3Cd4QgA';

export const EXAMPLE_TEMPLATE = `import { prompt } from 'tprompt';

// tprompt catches placeholder typos at \`tsc\` time, before the model.
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
  process.stderr.write('tprompt <command>\n');
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
      process.stdout.write(`  ${PLAYGROUND_URL}\n`);
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
