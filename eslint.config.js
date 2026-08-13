import js from '@eslint/js'
import babelParser from '@babel/eslint-parser'
import reactHooks from 'eslint-plugin-react-hooks'

export default [
  { ignores: ['dist/**', 'coverage/**', 'node_modules/**'] },
  {
    languageOptions: {
      globals: {
        chrome: 'readonly',
        console: 'readonly',
        document: 'readonly',
        setTimeout: 'readonly',
        URL: 'readonly',
        window: 'readonly',
      },
    },
  },
  js.configs.recommended,
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: { presets: ['@babel/preset-typescript'] },
      },
    },
    plugins: { 'react-hooks': reactHooks },
    rules: {
      ...reactHooks.configs.recommended.rules,
      // TypeScript's syntax is checked by `tsc`; ESLint's core rules do not
      // understand erased type names when Babel parses TS.
      'no-undef': 'off',
      'no-unused-vars': 'off',
    },
  }
]
