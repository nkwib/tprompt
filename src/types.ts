type IdentifierFirstChar =
  | 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j'
  | 'k' | 'l' | 'm' | 'n' | 'o' | 'p' | 'q' | 'r' | 's' | 't'
  | 'u' | 'v' | 'w' | 'x' | 'y' | 'z'
  | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J'
  | 'K' | 'L' | 'M' | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T'
  | 'U' | 'V' | 'W' | 'X' | 'Y' | 'Z'
  | '_';

type IdentifierTailChar =
  | IdentifierFirstChar
  | '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

type IsValidIdentifierTail<S extends string> = S extends ''
  ? true
  : S extends `${IdentifierTailChar}${infer Rest}`
    ? IsValidIdentifierTail<Rest>
    : false;

type IsValidIdentifier<S extends string> = S extends `${IdentifierFirstChar}${infer Rest}`
  ? IsValidIdentifierTail<Rest>
  : false;

type ExtractFromSegment<
  S extends string,
  Open extends string,
  Close extends string
> = S extends `${string}${Open}${infer Var}${Close}${infer Rest}`
  ? IsValidIdentifier<Var> extends true
    ? Var | ExtractFromSegment<Rest, Open, Close>
    : ExtractFromSegment<Rest, Open, Close>
  : never;

export type ExtractPlaceholders<
  Strings extends readonly string[],
  Open extends string,
  Close extends string
> = Strings extends readonly [infer Head extends string, ...infer Tail extends readonly string[]]
  ? ExtractFromSegment<Head, Open, Close> | ExtractPlaceholders<Tail, Open, Close>
  : never;

export type VariablesOf<P extends string> = [P] extends [never]
  ? Record<string, never>
  : { readonly [K in P]: string };

export interface Compiled<
  Strings extends readonly string[],
  Open extends string,
  Close extends string
> {
  readonly strings: Strings;
  readonly open: Open;
  readonly close: Close;
  readonly placeholders: ReadonlyArray<ExtractPlaceholders<Strings, Open, Close>>;
}
