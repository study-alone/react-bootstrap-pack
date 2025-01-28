import { contains } from './contains'
import { querySelectorAll } from './querySelectorAll'
import type { EventHandler } from './addEventListener'

/**
 * @note
 * legacy name: filterEvents
 */
export function filterEventHandler<K extends keyof HTMLElementEventMap>(
	selector: string,
	handler: EventHandler<HTMLElement, K>,
) {
	return function filterHandler(this: HTMLElement, event: HTMLElementEventMap[K]) {
		const top = event.currentTarget as HTMLElement
		const target = event.target as HTMLElement
		const matches = querySelectorAll(top, selector)

		if (matches.some((match) => contains(match, target))) {
			handler.call(this, event)
		}
	}
}
