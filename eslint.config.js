import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'
import nodePlugin from 'eslint-plugin-n'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

export default [
  ...compat.extends('eslint:recommended', 'prettier'),
  nodePlugin.configs['flat/recommended-script'],
  {
    languageOptions: {
      sourceType: 'module',
      // globals: {
      //   ...globals.node,
      // },
    },

    rules: {
      'no-console': 0,
      'n/exports-style': ['error', 'module.exports'],
    },
  },
]
