module.exports = {
  extends: ['plugin:tailwindcss/recommended', '@jdow'],
  plugins: ['tailwindcss'],
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
