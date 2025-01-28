import { createContext } from 'react'
import type { EventKey } from '../types'

interface NavContextValue {
	role?: string // used by NavItem to determine it's role
	activeKey: EventKey | null
	getControlledId: (key: EventKey | null) => string | null
	getControllerId: (key: EventKey | null) => string | null
}

export const NavContext = createContext<NavContextValue | null>(null)
