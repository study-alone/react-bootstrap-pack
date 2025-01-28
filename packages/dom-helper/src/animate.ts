import { style } from './css'
import { hyphenate } from './hyphenate'
import { isTransform, type TransformValue } from './isTransform'
import { transitionEnd } from './transitionEnd'
import type { EventHandler } from './addEventListener'
import type { Property } from './types'

const reset: Partial<Record<Property, string>> = {
	transition: '',
	'transition-duration': '',
	'transition-delay': '',
	'transition-timing-function': '',
}

type AnimateProperties = Record<number | symbol | TransformValue, string>
type EventHandlerTransitionEnd = EventHandler<HTMLElement, 'transitionend'>

interface Options {
	node: HTMLElement
	properties: AnimateProperties
	duration?: number
	easing?: string
	callback?: EventHandlerTransitionEnd
}

interface Cancel {
	cancel(): void
}

// transition을 위한 매우 간결한 애니메이션 기능
function _animate({ node, properties, duration = 200, easing, callback }: Options) {
	const cssProperties: Property[] = []
	const cssValues: Partial<Record<Property, string>> = {}
	let transform = ''

	Object.entries(properties).forEach(([key, value]) => {
		if (isTransform(key)) {
			transform += `${key}(${value}) `
		} else {
			cssValues[key as Property] = value
			cssProperties.push(hyphenate(key) as Property)
		}
	})

	if (transform) {
		cssValues.transform = transform
		cssProperties.push('transform')
	}

	function done(this: HTMLElement, event: TransitionEvent) {
		if (event.target !== event.currentTarget) return

		style(node, reset)
		if (callback) callback.call(this, event)
	}

	if (duration > 0) {
		const values = {
			transition: cssProperties.join(', '),
			['transition-duration']: `${duration / 1000}s`,
			['transition-delay']: '0s',
			['transition-timing-function']: easing || 'linear',
		}
		Object.entries(values).forEach(([key, value]) => {
			cssValues[key as Property] = value
		})
	}

	const removeListener = transitionEnd(node, done, duration)

	// eslint-disable-next-line @typescript-eslint/no-unused-expressions
	node.clientLeft // reflow

	style(node, cssValues)

	return {
		cancel() {
			removeListener()
			style(node, reset)
		},
	}
}

function animate(options: Options): Cancel
function animate(node: HTMLElement, properties: AnimateProperties, duration: number): Cancel
function animate(
	node: HTMLElement,
	properties: AnimateProperties,
	duration: number,
	callback: EventHandler<HTMLElement, 'transitionend'>,
): Cancel
function animate(
	node: HTMLElement,
	properties: AnimateProperties,
	duration: number,
	easing: string,
	callback: EventHandler<HTMLElement, 'transitionend'>,
): Cancel
function animate(
	nodeOrOptions: HTMLElement | Options,
	properties?: AnimateProperties,
	duration?: number,
	easing?: string | EventHandler<HTMLElement, 'transitionend'>,
	callback?: EventHandler<HTMLElement, 'transitionend'>,
) {
	if (!('nodeType' in nodeOrOptions)) {
		return _animate(nodeOrOptions)
	}

	if (!properties) {
		throw new Error('must include properties to animate')
	}

	if (typeof easing === 'function') {
		callback = easing
		easing = ''
	}

	return _animate({
		node: nodeOrOptions,
		properties,
		duration,
		easing,
		callback,
	})
}

export { animate }
