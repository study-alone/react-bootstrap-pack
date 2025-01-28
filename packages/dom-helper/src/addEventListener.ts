import { canUseDOM } from './canUseDOM'

export let optionsSupported = false
export let onceSupported = false

try {
	const options = {
		get passive() {
			return (optionsSupported = true)
		},
		get once() {
			return (onceSupported = optionsSupported = true)
		},
	}

	if (canUseDOM) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		window.addEventListener('test', options as any, options)
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		window.removeEventListener('test', options as any, true)
	}
} catch {
	/** */
}

export type EventHandler<T extends Document | HTMLElement, EN extends keyof EventMap<T>> = (
	this: T,
	event: EventMap<T>[EN],
) => void

export type EventMap<T extends HTMLElement | Document> = T extends Document
	? DocumentEventMap
	: HTMLElementEventMap

export const addEventListener = <
	T extends HTMLElement | Document,
	E extends Exclude<keyof EventMap<T>, number | symbol>,
>(
	node: T,
	eventName: E,
	handler: EventHandler<T, E>,
	options?: boolean | AddEventListenerOptions,
) => {
	node.addEventListener(eventName, handler as (e: Event) => void, options)
}

// type EventHandler = (
// 	event: Event | TransitionEvent | MouseEvent | KeyboardEvent,
// ) => void
// type TransitionEventHandler = (event: TransitionEvent) => void
// type Result = TransitionEventHandler extends EventHandler ? true : false
