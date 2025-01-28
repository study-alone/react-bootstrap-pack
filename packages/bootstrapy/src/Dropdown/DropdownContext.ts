import { createContext } from 'react'
import type { AlignType } from '../types'

export type DropDirection = 'up' | 'up-centered' | 'start' | 'end' | 'down' | 'down-centered'

export type DropdownContextValue = {
	align?: AlignType
	drop?: DropDirection
	isRTL?: boolean
}

export const DropdownContext = createContext<DropdownContextValue>({})
