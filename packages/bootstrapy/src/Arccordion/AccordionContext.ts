import { createContext } from 'react'

export type AccordionEventKey = string | string[] | null | undefined

export declare type AccordionSelectCallback = (
	eventKey: AccordionEventKey,
	event: React.SyntheticEvent<unknown>,
) => void

export interface AccordionContextValue {
	activeEventKey?: AccordionEventKey
	onSelect?: AccordionSelectCallback
	alwaysOpen?: boolean
}

export function isAccordionItemSelected(activeEventKey: AccordionEventKey, eventKey: string) {
	return Array.isArray(activeEventKey)
		? activeEventKey.includes(eventKey)
		: activeEventKey === eventKey
}

export const AccordionContext = createContext<AccordionContextValue>({})
AccordionContext.displayName = 'AccordionContext'
