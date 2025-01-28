/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
const config = {
	arrowParens: 'always',
	bracketSameLine: false,
	bracketSpacing: true,
	jsxSingleQuote: false,
	printWidth: 100,
	quoteProps: 'as-needed',
	semi: false,
	singleQuote: true,
	tabWidth: 4,
	trailingComma: 'all',
	useTabs: true,
	overrides: [
		{
			files: ['*.json', 'package.json'],
			options: {
				parser: 'json',
			},
		},
	],
}

export default config
