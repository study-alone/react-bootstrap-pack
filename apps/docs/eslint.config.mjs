import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'
import { nextJsConfig } from '@repo/eslint-config/next-js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
	baseDirectory: __dirname,
})

const eslintConfig = [
	...compat.extends('next/typescript'),
	...nextJsConfig({
		tsconfigRootDir: path.resolve(import.meta.dirname),
		project: path.resolve(import.meta.dirname, 'tsconfig.json'),
	}),
]

export default eslintConfig
