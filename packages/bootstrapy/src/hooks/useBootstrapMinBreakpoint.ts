import { useContext } from 'react'
import { ThemeContext } from '../ThemeProvider'

export function useBootstrapMinBreakpoint() {
	const { minBreakpoint } = useContext(ThemeContext)
	return minBreakpoint
}
