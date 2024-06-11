// @ts-check

import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'

const config = tseslint.config(eslint.configs.recommended, ...tseslint.configs.recommended)
config.ignores = ['./providers/wasm_kit.js']
export default config
