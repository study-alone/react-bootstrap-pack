import { DEFAULT_BREAKPOINTS, DEFAULT_MIN_BREAKPOINT } from '../ThemeProvider'
import type { GapValue } from '../types'

export type ResponsiveUtilityValue<T> =
	| T
	| {
			xs?: T
			sm?: T
			md?: T
			lg?: T
			xl?: T
			xxl?: T
	  }

export function createUtilityClasses(
	utilityValues: Record<string, ResponsiveUtilityValue<GapValue> | undefined>,
	breakpoints = DEFAULT_BREAKPOINTS,
	minBreakpoint = DEFAULT_MIN_BREAKPOINT,
) {
	const classes: string[] = []

	if (utilityValues) {
		Object.entries(utilityValues).forEach(([name, value]) => {
			if (value != null) {
				if (typeof value === 'object') {
					breakpoints.forEach((breakpoint) => {
						const breakpointValue = value[breakpoint]
						if (breakpointValue != null) {
							const infix = breakpoint !== minBreakpoint ? `-${breakpoint}` : ''
							classes.push(`${name}${infix}-${breakpointValue}`)
						}
					})
				} else {
					classes.push(`${name}-${value}`)
				}
			}
		})
	}

	return classes
}
