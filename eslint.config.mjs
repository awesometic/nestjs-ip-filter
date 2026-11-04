import js from '@eslint/js';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  js.configs.recommended,
  tseslint.configs.recommended,
  prettierRecommended,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
);
