import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/single-brace.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  sourcemap: true,
  splitting: false,
  treeshake: true,
  minify: false,
  target: 'node20'
});
