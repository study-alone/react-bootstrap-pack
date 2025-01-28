import { createContext } from 'react'

export interface AccordionItemContextValue {
	eventKey: string
}

export const AccordionItemContext = createContext<AccordionItemContextValue>({
	eventKey: '',
})
