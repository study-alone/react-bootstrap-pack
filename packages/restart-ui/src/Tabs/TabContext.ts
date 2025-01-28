import { createContext } from 'react'
import type { SelectCallback, EventKey, TransitionComponent } from '../types'

export interface TabContextValue {
	onSelect: SelectCallback
	activeKey?: EventKey
	transition?: TransitionComponent
	mountOnEnter: boolean
	unmountOnExit: boolean
	getControlledId: (key: EventKey | null) => string | null
	getControllerId: (key: EventKey | null) => string | null
}

export const TabContext = createContext<TabContextValue | null>(null)
