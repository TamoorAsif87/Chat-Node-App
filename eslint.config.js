const js = require('@eslint/js');
const ts = require('typescript-eslint');
const prettier = require('eslint-config-prettier');

/** @type {import("eslint").Linter.FlatConfig[]} */
module.exports = [
  {
    ignores: ['dist', 'node_modules'],
  },
  js.configs.recommended,
  ...ts.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: ts.parser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
  },
  prettier, // ← Just include the Prettier config here
];
