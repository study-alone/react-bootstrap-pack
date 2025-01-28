import path from 'path'
import { config as baseConfig } from '@repo/eslint-config/base'

export default [
	...baseConfig({
		tsconfigRootDir: path.resolve(import.meta.dirname),
		project: path.resolve(import.meta.dirname, 'tsconfig.json'),
	}),
	{
		rules: {
			'@typescript-eslint/no-unsafe-assignment': 'off',
			'@typescript-eslint/no-unsafe-member-access': 'off',
			'@typescript-eslint/no-unsafe-call': 'off',
			'@typescript-eslint/no-unsafe-return': 'off',
		},
	},
]
