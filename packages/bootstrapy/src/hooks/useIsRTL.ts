import { useContext } from 'react'
import { ThemeContext } from '../ThemeProvider'

export function useIsRTL() {
	const { dir } = useContext(ThemeContext)
	return dir === 'rtl'
}
