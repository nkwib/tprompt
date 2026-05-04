import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseArgs } from 'node:util';

export const PLAYGROUND_URL =
  'https://www.typescriptlang.org/play/#code/PTAEBcAcCcHsFtLggT0gUwLSwHYBsVQBncAVwCNQAzWaUAFQGVQAFPAQxQHM5ScATAHQAoEKACSOUO1DR07PKBiwAVugDGyFLFKgA7jrz990AJbh0oAAanEtZAG8lcRMgC+1F6ADkAARwA1nqm5MBQLkjeVqCAKASiYOAAFqZExGSUKaCm+NnoxonocsSwEAWsHNy8AqB42QH6tAGpwUk6yDiQ8CLC4GiWADLo4BZ0ALzCoKAAPj7s3tM+5PMz3urLPvzr3uhbVFtcW4lbplsq3hML3gFbeFvwWzhbsFuQWwCOW9BbRFvg55MrUhbABuWz0WwAHlsUFsAF7-S4AQS2ACEtgBhLYAES2AFEtgAxLYAcS2AAktuItgApBErADSW36WwAslsAHJbADyWxYWwAilsAEpbRhbeh0nwAVS2ADUtgB1LYADS2AE0tgAtLYAfW8AG4en0JPx0Yl2GNQINhoVLgAGbxTbwARkd3gATG6AMxugAsboArG6AGxugDsboAHG6AJwGo0YE30dimPAAHmY6AhFgEqRIZhwXAAfKBxpNM9n0LmfPMAPwQaCkdAXABcoArOf4qSsABIHOJTeboG4+9kqLahW5ovWB8nU2mhSW21QFER0IbeonxEQBxnQFnO3nwAXi6WLh2q13rH3rSMRw4xxOp6AZ-w5+nF6Bl6v1wnLLjs2gdhNDYYD0ESWAjEKIg9wPS8jxPAAaUBEXUdR90rat82yLhS1AHB0GBQoSzLdsMMPa8HGwws3AcBxRxwcc6FlNxWIYpjQCFdASCnC5JhnHd+DTWUSzg6tjybPjJhfUAAOPYDwFA9RwMg-hoIXbjwGQ1D0JmESpMmNs5KAkCOGUiCoOgGCuJIbS0KLKS2x0jdjVlC1THYcg8G4rkqDTFhyPgtITxIi4AG0WAAXUC6swoIojoGi+suPUWghOorhkPi4iv1AJw5HYfhcAIUAwvpLIpCitsMtANxDWyEYV2U0B0QQSBUzyWDMKvDKSwcC4WkSAAKYELSINs3LMTzvKIXy02MhSlJUyyYMYIsiwASmq48cMNNxhDU9QOCKKg+E0UxcGcNrwDTVKcBIMixJ6nbCyLIaLEQDgLDbRgtpatqOqEtbDXiUBAABSCHIah6GYdhuH4YRxHIdB+gyj0PIuHQNs5Bwdh4EsOjSCIaB2Tx9BWIgEpCbXEmyYp8h0DwWA9Ep0AjvkOgkksQo4GgEQxCRwWheF4XhGEO6Hp4dAhjw5RXCGi5vDJRmmeQ6nafx1iAEJQDVHQ6EgDgpEyOjDfYHB6FMQoKaGpn1AULG8ocO2HdYjbBHODaQaloZBEGob+smInClJ-G228BRTGU7xkLEQAEwlYOAMGgXofCJjWdiyVJ4BSIgcIq1AMGQ7xg4z+Yiu4-DYGQLMUnAC4zYtq3oHD5QY4uF3vPDqtMClMVhDcL3hCAA';

export const EXAMPLE_TEMPLATE = `import { prompt } from '@nkwib/tprompt';

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
