// Rasterize static/og.svg → static/og.png at 1200×630.
// Run manually after editing the SVG: `node scripts/build-og.mjs` (or `pnpm build:og`).
// The PNG is committed; CI does not regenerate it.
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Resvg } from '@resvg/resvg-js';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const svgPath = resolve(root, 'static/og.svg');
const outPath = resolve(root, 'static/og.png');

const svg = readFileSync(svgPath, 'utf8');

const resvg = new Resvg(svg, {
  fitTo: { mode: 'width', value: 1200 },
  font: {
    fontFiles: [
      resolve(root, 'node_modules/@fontsource/jetbrains-mono/files/jetbrains-mono-latin-700-normal.woff2'),
      resolve(root, 'node_modules/@fontsource/jetbrains-mono/files/jetbrains-mono-latin-500-normal.woff2'),
      resolve(root, 'node_modules/@fontsource/inter/files/inter-latin-600-normal.woff2'),
      resolve(root, 'node_modules/@fontsource/inter/files/inter-latin-400-normal.woff2'),
    ],
    loadSystemFonts: true,
    defaultFontFamily: 'Inter',
  },
});

const png = resvg.render().asPng();
writeFileSync(outPath, png);
console.log(`Wrote ${outPath} (${png.byteLength} bytes)`);
