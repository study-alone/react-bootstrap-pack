import { style } from './css'
import { listen } from './listen'
import { triggerEvent } from './triggerEvent'

export type Listener = (this: HTMLElement, event: TransitionEvent) => void

function parseDurarion(node: HTMLElement) {
	const str = style(node, 'transition-duration') || ''
	const multiply = str.indexOf('ms') === -1 ? 1000 : 1

	return parseFloat(str) * multiply
}

function emulateTransitionEnd(element: HTMLElement, duration: number, padding = 5) {
	let called = false

	const handle = setTimeout(() => {
		if (!called) triggerEvent(element, 'transitionend', true)
	}, duration + padding)

	const remove = listen(
		element,
		'transitionend',
		() => {
			called = true
		},
		{ once: true },
	)

	return () => {
		clearTimeout(handle)
		remove()
	}
}

export function transitionEnd(
	element: HTMLElement,
	handler: Listener,
	duration?: number | null,
	padding?: number,
) {
	if (duration == null) {
		duration = parseDurarion(element) || 0
	}

	const removeEmulate = emulateTransitionEnd(element, duration, padding)
	const remove = listen(element, 'transitionend', handler)

	return () => {
		removeEmulate()
		remove()
	}
}
