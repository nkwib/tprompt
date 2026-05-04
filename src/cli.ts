import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseArgs } from 'node:util';

export const PLAYGROUND_URL =
  'https://www.typescriptlang.org/play?#code=PTAEAcCcHsFtwC4GsCWDQIJ7gKYFpoA7AG01AGcEBXAI1ADNpJQAVAZVAAViBDTAcxhVCAEwB0AKBCgAkoVA9QkHD2IQYAKxwBjdJmhVQAdwPERxyGhygABinhN0Ab3VxEoAL4MYsUAHIoN2Q0PxtQQBQCKTAEAAsUcgpqOnjQFBI0nHMYnGUKaAxsrl4BIVFQYjSkYyYkBKM0GIN0QnBYSQksXFAAGRwEBBzQAF4JUFAAH38ePwn-GhnJv20F-xEVvxx1+nX+dZj1lHWNP1HZvyR14nXYdcJ16HXwdYBHdch18nWEE7HFqnWAG7rIzrAAe60w6wAXj8zgBBdYAIXWAGF1gARdYAUXWADF1gBxdYACXWMnWAClYYsANLrbrrACy6wAcusAPLrTjrACK6wASus2OsWNT-ABVdYANXWAHV1gANdYATXWAC11gB9PwAbg62GsMhEKJiPGYQx6fQGzEWAAY-OM-ABGB1+ABMroAzK6ACyugCsroAbK6AOyugAcroAnLr9V0jSweChiAAeDg4UEDUQJSiWQj8AB8w1OGazOBz-hmAH4MJAqDhTgAuUBl7MiBI2AAkTiNJrNHh7aXog35HjCtcTybT-OLLfoqnIOD1nUN5CN6dAmfbuYQ+aLJbGbYrHdsPd6-Ryg6cw9H49Ak5ESZTqdnoHni+X8esWKzkB4ujcABOCNGYOTkJu24nru+4ADSgHC2jaFu5aVnmaT8MMoCEDgAI5MWIxHihO5nk46EFh4ThOEOhAjswUoeIxNF0aA-I4JQ46nGMk7riIqZSsWUGVnuDZcWMD6gL+e4AQgQHaCB0BgZAEFsZQ8GIchkwCWJYwtlJ-6Abw8mgSI4GvuxCDqUhhZiS2GkrgaoBSmaKA8DQxDsey9CppwxHQYk+4EacADanAALp+ZWwU4XhkARbWbHaEwfHkfw8Exfh76gC4yg8CIRCkKAwU0qk8jhS2qWeHqaTWgu8mgCibgppkkGoaeqXFk4pz1LEAAUAJmuQLbOZYbkeeQXmpvpMlyQpSkQWwhaFgAlBVe4YXqHgSKZ2i8Lk9DCLoKBEK48AIKmSWEJQraRe160FoWvUDPAvADC2bCrQ1TUeXxi16lEoCAACkwMg6DYPgxDkNQ9DMMgwDLCFEYmT8DgLbKIQPCwNYVFUOQkAspjOCMRg+Q40u+OE8TNA4MQ0BGCToC7SozCxNYOQwJAkjSLDPO83zfMSBIl3XYIOB9FhgRnb1px+MSNO0-BZMU1jjEAISgMqBjMOAvDyCkVE6zwhAsCgV5eL1tPaKoqPZU4lvW4xy1iCcy3-aLfRiD1MS9V1Yy4zkBNYy2fiqCg8l+PB0iAAmEXAwLgkBYP4uPK5sqQJLA8TkBhpUYAa8F+P7KczPl7HYdA6CZvegRn69KefjEjTtP-DoTBC8LSAm6Acvy8AivQGr3kIbMmtO35bvvB7sEs9z2t6+PuAGnP86CIQVKgsKEgeK7EhAA';

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
