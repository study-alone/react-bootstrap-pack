import type { EventHandler, EventMap } from './addEventListener'

/**
 * A `removeEventListener` ponyfill
 *
 * @param node the element
 * @param eventName the event name
 * @param handle the handler
 * @param options event options
 */
export function removeEventListener<
	T extends Document | HTMLElement,
	E extends Exclude<keyof EventMap<T>, number | symbol>,
>(node: T, eventName: E, handler: EventHandler<T, E>, options?: boolean | AddEventListenerOptions) {
	const capture = options && typeof options !== 'boolean' ? options.capture : options

	node.removeEventListener(eventName, handler as (e: Event) => void, capture)

	// if (handler.__once) {
	// 	node.removeEventListener(eventName, handler.__once, capture)
	// }
}
