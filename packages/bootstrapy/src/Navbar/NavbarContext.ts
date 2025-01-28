import { createContext } from 'react'

export interface NavbarContextValue {
	onToggle(): void
	bsPrefix?: string
	expanded: boolean
	expand?: boolean | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
}

export const NavbarContext = createContext<NavbarContextValue | null>(null)
NavbarContext.displayName = 'NavbarContext'
