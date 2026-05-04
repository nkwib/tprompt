import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    typecheck: {
      enabled: true,
      tsconfig: './tsconfig.test.json',
      include: ['tests/types/**/*.test-d.ts']
    },
    include: ['tests/runtime/**/*.test.ts']
  }
});
