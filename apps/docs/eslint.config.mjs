import path from 'node:path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'
import { nextJsConfig } from '@repo/eslint-config/next-js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const compat = new FlatCompat({
	baseDirectory: __dirname,
})

/**
 * @type {import('eslint').Linter.Config}
 */
const config = [
	...compat.extends('next/typescript'),
	...nextJsConfig({
		tsconfigRootDir: path.resolve(import.meta.dirname),
		project: path.resolve(import.meta.dirname, 'tsconfig.json'),
	}),
]

export default config
