import { style, transitionEnd } from '@repo/dom-helper'

const parseDuration = (node: HTMLElement, property: 'transitionDuration' | 'transitionDelay') => {
	const str = style(node, property) || ''
	const mult = str?.indexOf('ms') === -1 ? 1000 : 1

	return parseFloat(str) * mult
}

export const transitionEndListener = (
	element: HTMLElement,
	handler: (event: TransitionEvent) => void,
) => {
	const duration = parseDuration(element, 'transitionDuration')
	const delay = parseDuration(element, 'transitionDelay')
	const remove = transitionEnd(
		element,
		(event) => {
			if (event.target === element) {
				remove()
				handler(event)
			}
		},
		duration + delay,
	)
}
