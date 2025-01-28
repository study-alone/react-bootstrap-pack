import { createContext } from 'react'
import type { EventKey, SelectCallback } from './types'

export const SelectableContext = createContext<SelectCallback | null>(null)

export const makeEventKey = (eventKey?: EventKey | null, href: string | null = null) => {
	if (eventKey != null) return String(eventKey)

	return href || null
}
