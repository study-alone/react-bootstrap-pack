declare module 'eslint-plugin-import' {
	import type { Linter } from 'eslint'

	type ConfigNames =
		| 'recommended'
		| 'errors'
		| 'warnings'
		| 'react'
		| 'react-native'
		| 'electron'
		| 'typescript'

	const plugin: {
		readonly rules: Record<string, Rule.RuleModule>
		readonly configs: Record<ConfigNames | 'stage-0', Linter.LegacyConfig>
		readonly flatConfigs: Record<ConfigNames, Linter.Config>
	}

	export = plugin
}

declare module 'eslint-plugin-react-hooks' {
	import type { Linter, Linter, Rule } from 'eslint'

	const plugin: {
		configs: {
			recommended: Linter.LegacyConfig
		}
		rules: Record<string, Rule.RuleModule>
	}

	export = plugin
}