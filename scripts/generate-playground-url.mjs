#!/usr/bin/env node
// Generates a TS Playground URL for the tprompt "typo becomes a tsc error"
// demo. The Playground encodes its snippet via lz-string with a URL-safe
// alphabet (`compressToEncodedURIComponent`). Run with: `node scripts/generate-playground-url.mjs`.

import lzString from 'lz-string';
const { compressToEncodedURIComponent } = lzString;

const snippet = `// tprompt type-only stub for TS Playground.
// In a real project you would write \`import { prompt } from 'tprompt'\` —
// this stub is inlined here so the Playground link works without npm.

type Letter =
  | 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j'
  | 'k' | 'l' | 'm' | 'n' | 'o' | 'p' | 'q' | 'r' | 's' | 't'
  | 'u' | 'v' | 'w' | 'x' | 'y' | 'z'
  | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J'
  | 'K' | 'L' | 'M' | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T'
  | 'U' | 'V' | 'W' | 'X' | 'Y' | 'Z' | '_';
type IdChar = Letter | '0'|'1'|'2'|'3'|'4'|'5'|'6'|'7'|'8'|'9';
type IdTail<S extends string> =
  S extends '' ? true
  : S extends \`\${IdChar}\${infer R}\` ? IdTail<R> : false;
type IsId<S extends string> =
  S extends \`\${Letter}\${infer R}\` ? IdTail<R> : false;
type ExtractPlaceholders<S extends string, Acc extends string = never> =
  S extends \`\${string}{{\${infer V}}}\${infer Rest}\`
    ? IsId<V> extends true
      ? ExtractPlaceholders<Rest, Acc | V>
      : ExtractPlaceholders<Rest, Acc>
    : Acc;
type VariablesOf<P extends string> =
  [P] extends [never] ? Record<string, never> : { readonly [K in P]: string };
interface Compiled<S extends string> {
  with(vars: VariablesOf<ExtractPlaceholders<S>>): string;
}
declare function prompt<const S extends string>(template: S): Compiled<S>;

// ─────────────────────────────────────────────────────────────────────
// The wedge: rename {{usrName}} to {{userName}} below to clear the error.
// ─────────────────────────────────────────────────────────────────────

const greet = prompt(
  'Hello, {{usrName}}! Your plan is {{planTier}} (locale: {{locale}}).'
);

greet.with({
  userName: 'alice', // ← Property 'usrName' is missing in type, 'userName' does not exist
  planTier: 'pro',
  locale: 'en-US'
});
`;

const encoded = compressToEncodedURIComponent(snippet);
process.stdout.write(`https://www.typescriptlang.org/play?#code=${encoded}\n`);
