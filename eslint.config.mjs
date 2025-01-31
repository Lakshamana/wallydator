import eslintPluginPrettier from 'eslint-plugin-prettier/recommended'

export default [
  eslintPluginPrettier,
  {
    ignores: ['**/node_nodules', '**/dist', '**/coverage'],
  },
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    rules: {
      '@typescript-eslint/consistent-type-definitions': 'off',
      '@typescript-eslint/strict-boolean-expressions': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-namespace': 'off',
      '@typescript-eslint/return-await': 'off',
    },
  },
]
