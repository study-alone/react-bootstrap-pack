import { useContext } from 'react'
import { ThemeContext } from '../ThemeProvider'

export function useBootstrapPrefix(prefix: string | undefined, defaultPrefix: string) {
	const { prefixes } = useContext(ThemeContext)

	return prefix || prefixes[defaultPrefix] || defaultPrefix
}
