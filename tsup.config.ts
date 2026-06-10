import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: ['src/index.ts', 'src/single-brace.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    clean: true,
    sourcemap: false,
    splitting: false,
    treeshake: true,
    minify: false,
    target: 'node20',
    removeNodeProtocol: false
  },
  {
    entry: ['src/cli.ts'],
    format: ['cjs'],
    dts: false,
    clean: false,
    sourcemap: false,
    splitting: false,
    treeshake: true,
    minify: false,
    target: 'node20',
    removeNodeProtocol: false,
    banner: { js: '#!/usr/bin/env node' }
  }
]);
