import { addEventListener, type EventHandler, type EventMap } from './addEventListener'
import { removeEventListener } from './removeEventListener'

function listen<
	T extends HTMLElement | Document,
	E extends Exclude<keyof EventMap<T>, number | symbol>,
>(node: T, eventName: E, handler: EventHandler<T, E>, options?: boolean | AddEventListenerOptions) {
	addEventListener(node, eventName, handler, options)
	return () => {
		removeEventListener(node, eventName, handler, options)
	}
}

export { listen }
