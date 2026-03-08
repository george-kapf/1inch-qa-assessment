import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettierConfig from 'eslint-config-prettier';

/**
 * PHASE 1: STATIC CODE ANALYSIS CONFIGURATION
 * This file defines the "Coding Standards" for the project. 
 * It ensures the TypeScript code is clean, consistent, and free of common bugs.
 */
export default [
  {
    // Target only our TypeScript test files.
    files: ['tests/**/*.ts'],
    languageOptions: {
      parser: tsParser, // Uses the specialized TypeScript parser.
      parserOptions: {
        project: './tsconfig.json',
        ecmaVersion: 2022,
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      /**
       * TYPE SAFETY RULE:
       * '@typescript-eslint/no-explicit-any': 'error'
       * This is crucial. It forbids using 'any', forcing the use of 
       * Interfaces (like User and Order) to ensure strict data validation.
       */
      '@typescript-eslint/no-explicit-any': 'error',

      // Errors if variables are defined but never used, helping keep the code lean.
      // It allows variables starting with '_' (like in health check routes).
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],

      // We allow non-null assertions (!) because in BDD, we often verify 
      // an object is NOT null (e.g., retrievedUser) before accessing it.
      '@typescript-eslint/no-non-null-assertion': 'off',

      // Allowed for mock services to log "Service running on port..." in the terminal.
      'no-console': 'off',
    },
  },
  // Integration with Prettier to prevent styling conflicts (tabs vs spaces).
  prettierConfig,
];
