import { useContext } from 'react'
import { ThemeContext } from '../ThemeProvider'

export function useBootstrapBreakpoints() {
	const { breakpoints } = useContext(ThemeContext)
	return breakpoints
}
