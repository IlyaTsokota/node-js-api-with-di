import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier';
import { defineConfig } from 'eslint/config';

export default defineConfig([
    {
        ignores: ['dist/**', 'node_modules/**'],
    },

    // (eslint:recommended)
    js.configs.recommended,

    // TypeScript
    ...tseslint.configs.recommended,

    {
        files: ['**/*.{ts,tsx}'],

        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                sourceType: 'module',
            },
            globals: {
                ...globals.browser,
            },
        },

        plugins: {
            '@typescript-eslint': tseslint.plugin,
            prettier,
        },

        rules: {
            // === My Rules ===
            '@typescript-eslint/ban-types': 'off',
            '@typescript-eslint/no-unused-vars': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/explicit-function-return-type': 'warn',

            // === Prettier ===
            'prettier/prettier': [
                'error',
                {
                    singleQuote: true,
                    useTabs: false,
                    semi: true,
                    trailingComma: 'all',
                    bracketSpacing: true,
                    printWidth: 100,
                    endOfLine: 'auto',
                    tabWidth: 4,
                },
            ],
        },
    },
]);
