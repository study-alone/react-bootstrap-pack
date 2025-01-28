import {
	arrow,
	computeStyles,
	eventListeners,
	flip,
	hide,
	offset,
	popperGenerator,
	popperOffsets,
	preventOverflow,
} from '@popperjs/core'
import type { Placement } from '@popperjs/core'

export const createPopper = popperGenerator({
	defaultModifiers: [
		hide,
		popperOffsets,
		computeStyles,
		eventListeners,
		offset,
		flip,
		preventOverflow,
		arrow,
	],
})

export type { Placement }
