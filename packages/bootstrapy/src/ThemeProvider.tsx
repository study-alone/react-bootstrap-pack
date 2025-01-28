import * as React from 'react'

export const DEFAULT_BREAKPOINTS = ['xxl', 'xl', 'lg', 'md', 'sm', 'xs'] as const
export const DEFAULT_MIN_BREAKPOINT = 'xs'

export interface ThemeContextValue {
	prefixes: Record<string, string>
	breakpoints: typeof DEFAULT_BREAKPOINTS
	minBreakpoint?: string
	dir?: string
}

export const ThemeContext = React.createContext<ThemeContextValue>({
	prefixes: {},
	breakpoints: DEFAULT_BREAKPOINTS,
	minBreakpoint: DEFAULT_MIN_BREAKPOINT,
})
