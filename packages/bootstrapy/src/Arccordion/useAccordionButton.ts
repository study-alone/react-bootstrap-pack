import { useContext } from 'react'
import { AccordionContext } from './AccordionContext'
import type { AccordionEventKey } from './AccordionContext'

export type EventHandler = React.EventHandler<React.SyntheticEvent>

export function useAccordionButton(eventKey: string, onClick?: EventHandler) {
	const { activeEventKey, onSelect, alwaysOpen } = useContext(AccordionContext)

	return (event: React.SyntheticEvent) => {
		let eventKeyPassed: AccordionEventKey = eventKey === activeEventKey ? null : eventKey

		if (alwaysOpen) {
			if (Array.isArray(activeEventKey)) {
				if (activeEventKey.includes(eventKey)) {
					eventKeyPassed = activeEventKey.filter((key) => key !== eventKey)
				} else {
					eventKeyPassed = [...activeEventKey, eventKey]
				}
			} else {
				eventKeyPassed = [eventKey]
			}
		}

		onSelect?.(eventKeyPassed, event)
		onClick?.(event)
	}
}
