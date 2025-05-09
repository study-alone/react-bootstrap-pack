import fs from 'node:fs'
import globals from 'globals'
import eslint from '@eslint/js'
import turboPlugin from 'eslint-plugin-turbo'
import tseslint from 'typescript-eslint'
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y'
// import eslintConfigPrettier from 'eslint-config-prettier'
// import onlyWarn from 'eslint-plugin-only-warn'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import reactPluginOfficial from 'eslint-plugin-react'
import importPlugin from 'eslint-plugin-import'
import prettierPluginRecommended from 'eslint-plugin-prettier/recommended'

if (typeof module !== 'undefined' && module.exports) {
	console.log('\u{1F680} This is a CommonJS environment.')
} else {
	console.log('\u{1F680} This is an ES Module environment.')
}

/**
 * A shared ESLint configuration for the repository.
 * @type {(args: { project: string, tsconfigRootDir: string }) => import("eslint").Linter.Config[]}
 * */
export const config = ({ project, tsconfigRootDir }) => {
	/** @type {Record<string, Record<string, string>>} */
	const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'))

	/** @type {string} */
	const currentReactVersion = packageJson.dependencies?.react
		? (packageJson.dependencies.react || '').replace(/[^0-9.]/g, '')
		: 'detect'

	console.log('@@@@@', tsconfigRootDir)

	return [
		{
			ignores: ['**/dist', '**/build', '**/.vscode'],
		},
		eslint.configs.recommended,
		...tseslint.configs.recommendedTypeChecked,
		jsxA11yPlugin.flatConfigs.recommended,
		importPlugin.flatConfigs.recommended,
		prettierPluginRecommended,
		{
			languageOptions: {
				parserOptions: {
					ecmaFeatures: { jsx: true },
					tsconfigRootDir,
					/** @see https://github.com/vitejs/vite/issues/13747 */
					project: [project],
				},
				globals: { ...globals.browser },
			},
			settings: {
				react: {
					version: currentReactVersion,
				},
				'import/resolver': {
					typescript: {
						project: [project],
					},
				},
			},
		},
		{
			plugins: {
				'@typescript-ealint': tseslint.plugin,
				react: reactPluginOfficial,
				/** @see https://github.com/facebook/react/issues/28313 */
				'react-hooks': reactHooksPlugin,
				turbo: turboPlugin,
			},
			rules: {
				...reactPluginOfficial.configs.recommended.rules,
				...reactPluginOfficial.configs['jsx-runtime'].rules,
				...reactHooksPlugin.configs.recommended.rules,
				'turbo/no-undeclared-env-vars': 'warn',
				// 'react-refresh/only-export-components': 'warn',
				'@typescript-eslint/no-unused-vars': 'warn',
				'@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: false }],
				'react/button-has-type': 'error',
				'react/prop-types': 'off',
				'react/self-closing-comp': [
					'error',
					{
						component: true,
						html: true,
					},
				],
				'react/jsx-closing-bracket-location': ['error', 'line-aligned'],
				'no-void': ['error', { allowAsStatement: true }],
				camelcase: 'off',
				/** @note 근거: null일 수 있는 가능성이 존재하는 코드도 null을 사용할 수 없게 만듬, HTMLElement를 셀렉팅할때는 null반환의 가능성이 항상 존재함 */
				'@rushstack/no-new-null': 'off',
				/** @note 근거: 타입 추론 관점에서 type, interface 문법을 허용, 가독성을 크게 해치지 않는다고 판단 */
				'@typescript-eslint/consistent-type-definitions': 'off',
				/** @note 근거: 타입 추론이 가능함에도 return 타입을 강요함 */
				'@typescript-eslint/explicit-function-return-type': 'off',
				/** @note 근거: 타입 추론으로 충분한 곳에 타이핑을 강요함 */
				'@rushstack/typedef-var': 'off',
				'@typescript-eslint/naming-convention': 'off',
				'@typescript-eslint/unbound-method': 'off',
				'import/order': [
					'error',
					{
						groups: [
							'builtin',
							'external',
							'internal',
							'parent',
							'sibling',
							'index',
							'object',
							'type',
						],
						pathGroups: [
							{
								pattern: 'react',
								group: 'builtin',
							},
							{
								pattern: '@/*',
								group: 'internal',
								position: 'after',
							},
						],
					},
				],
				'react-hooks/exhaustive-deps': [
					'warn',
					{
						additionalHooks: '(useIsomorphicEffect)',
					},
				],
			},
		},
	]
}
