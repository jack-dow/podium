/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json', './apps/*/tsconfig.json', './packages/*/tsconfig.json'],
  },
  extends: ['plugin:tailwindcss/recommended', '@jdow'],
  plugins: ['tailwindcss', '@typescript-eslint'],
  rules: {
    'react/jsx-indent': [2, 2],
    'arrow-parens': ['error', 'always'],
    'multiline-ternary': 'off',
    '@typescript-eslint/brace-style': ['off'],
    '@typescript-eslint/indent': ['off'],
    'operator-linebreak': 'off',
    'curly': ['error', 'multi-line', 'consistent'],
  },
};
