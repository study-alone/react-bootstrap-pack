import type { UsePopperOptions, Offset, Placement, Modifiers } from './usePopper'

export type Config = {
	flip?: boolean
	fixed?: boolean
	alignEnd?: boolean
	enabled?: boolean
	containerPadding?: number
	arrowElement?: Element | null
	enableEvents?: boolean
	offset?: Offset
	placement?: Placement
	popperConfig?: UsePopperOptions
}

export function toModifierMap(modifiers: Modifiers | undefined) {
	const result: Modifiers = {}

	if (!Array.isArray(modifiers)) {
		return modifiers || result
	}

	modifiers?.forEach((m) => {
		const name = m.name as string
		if (name) {
			result[name] = m
		}
	})
	return result
}

export function toModifierArray(map: Modifiers | undefined = {}) {
	if (Array.isArray(map)) return map

	return Object.entries(map).map(([key, value]) => {
		value.name = key
		return value
	})
}

export function mergeOptionsWithPopperConfig({
	enabled,
	enableEvents,
	placement,
	flip,
	offset,
	fixed,
	containerPadding,
	arrowElement,
	popperConfig = {},
}: Config): UsePopperOptions {
	const modifiers = toModifierMap(popperConfig.modifiers)

	return {
		...popperConfig,
		placement,
		enabled,
		strategy: fixed ? 'fixed' : popperConfig.strategy,
		modifiers: toModifierArray({
			...modifiers,
			eventListeners: {
				enabled: enableEvents,
				options: modifiers.eventListeners?.options,
			},
			preventOverflow: {
				...modifiers.preventOverflow,
				options: containerPadding
					? {
							padding: containerPadding,
							...modifiers.preventOverflow?.options,
						}
					: modifiers.preventOverflow?.options,
			},
			offset: {
				options: {
					offset,
					...modifiers.offset?.options,
				},
			},
			arrow: {
				...modifiers.arrow,
				enabled: !!arrowElement,
				options: {
					...modifiers.arrow?.options,
					element: arrowElement,
				},
			},
			flip: {
				enabled: !!flip,
				...modifiers.flip,
			},
		}),
	}
}
