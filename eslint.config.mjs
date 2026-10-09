import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import prettier from 'eslint-config-prettier/flat';

export default defineConfig([
  // Next.js rules + React, hooks, jsx-a11y and Core Web Vitals checks.
  ...nextVitals,
  // Last, so it turns off every stylistic rule that would fight with Prettier.
  prettier,
  globalIgnores(['.next/**', 'out/**', 'node_modules/**']),
]);
