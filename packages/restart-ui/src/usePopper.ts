import * as Popper from '@popperjs/core'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { dequal } from 'dequal'
import { useSafeState } from '@repo/restart-hooks'
import { createPopper } from './popper'

const disabledApplyStylesModifiers = {
	name: 'applyStyles',
	enabled: false,
	phase: 'afterWrite',
	fn: () => undefined,
}

export type Modifier<Name, Options extends Popper.Obj> = Popper.Modifier<Name, Options>
export type Options = Popper.Options
export type Instance = Popper.Instance
export type Placement = Popper.Placement
export type VirtualElement = Popper.VirtualElement
export type State = Popper.State

export type OffsetValue = [number | null | undefined, number | null | undefined]
export type OffsetFunction = (details: {
	popper: Popper.Rect
	reference: Popper.Rect
	placement: Placement
}) => OffsetValue

export type Offset = OffsetFunction | OffsetValue

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ModifierMap = Record<string, Partial<Modifier<any, any>>>
export type Modifiers =
	| Popper.Options['modifiers']
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	| Record<string, Partial<Modifier<any, any>>>

export type UsePopperOptions = Omit<Options, 'modifiers' | 'placement' | 'strategy'> & {
	enabled?: boolean
	placement?: Options['placement']
	strategy?: Options['strategy']
	modifiers?: Options['modifiers']
}

export interface UsePopperState {
	placement: Placement
	update: () => void
	forceUpdate: () => void
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	attributes: Record<string, Record<string, any>>
	styles: Record<string, Partial<CSSStyleDeclaration>>
	state?: State
}

const ariaDescribedByModifier: Modifier<'ariaDescribedBy', Record<string, never>> = {
	name: 'ariaDescribedBy',
	enabled: true,
	phase: 'afterWrite',
	effect:
		({ state }) =>
		() => {
			const { reference, popper } = state.elements

			if ('removeAttribute' in reference) {
				const ids = (reference.getAttribute('aria-describedby') || '')
					.split(',')
					.filter((id) => id.trim() !== popper.id)

				if (!ids.length) {
					reference.removeAttribute('aria-describedby')
				} else {
					reference.setAttribute('aria-describedby', ids.join(','))
				}
			}
		},
	fn: ({ state }) => {
		const { popper, reference } = state.elements

		const role = popper.getAttribute('role')?.toLowerCase()

		if (popper.id && role === 'tooltip' && 'setAttribute' in reference) {
			const ids = reference.getAttribute('aria-describedby')
			if (ids && ids.split(',').indexOf(popper.id) !== -1) {
				return
			}

			reference.setAttribute('aria-describedby', ids ? `${ids},${popper.id}` : popper.id)
		}
	},
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const EMPTY_MODIFIERS = [] as any

/**
 * Position an element relative some reference element using Popper.js
 *
 * @param referenceElement
 * @param popperElement
 * @param {object}      options
 * @param {object=}     options.modifiers Popper.js modifiers
 * @param {boolean=}    options.enabled toggle the popper functionality on/off
 * @param {string=}     options.placement The popper element placement relative to the reference element
 * @param {string=}     options.strategy the positioning strategy
 * @param {function=}   options.onCreate called when the popper is created
 * @param {function=}   options.onUpdate called when the popper is updated
 *
 * @returns {UsePopperState} The popper state
 */
export function usePopper(
	referenceElement: VirtualElement | null | undefined,
	popperElement: HTMLElement | null | undefined,
	{
		enabled = true,
		placement = 'bottom',
		strategy = 'absolute',

		modifiers = EMPTY_MODIFIERS,
		...config
	}: UsePopperOptions,
) {
	const prevModifiers = useRef<UsePopperOptions['modifiers']>(modifiers)
	const popperInstanceRef = useRef<Instance | undefined>(undefined)

	const update = useCallback(() => {
		popperInstanceRef.current?.update().catch((e) => new Error(`${e}`))
	}, [])

	const forceUpdate = useCallback(() => {
		popperInstanceRef.current?.forceUpdate()
	}, [])

	const [popperState, setState] = useSafeState(
		useState<UsePopperState>({
			placement,
			update,
			forceUpdate,
			attributes: {},
			styles: {
				popper: {},
				arrow: {},
			},
		}),
	)

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const updateModifier = useMemo<Modifier<'updateStateModifier', any>>(
		() => ({
			name: 'updateStateModifier',
			enabled: true,
			phase: 'write',
			requires: ['computeStyles'],
			fn: ({ state }) => {
				const styles: UsePopperState['styles'] = {}
				const attributes: UsePopperState['attributes'] = {}

				Object.keys(state.elements).forEach((element) => {
					styles[element] = state.styles[element] as Partial<CSSStyleDeclaration>
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					attributes[element] = state.attributes[element] as Record<string, any>
				})

				setState({
					state,
					styles,
					attributes,
					update,
					forceUpdate,
					placement: state.placement,
				})
			},
		}),
		[forceUpdate, setState, update],
	)

	const nextModifiers = useMemo(() => {
		if (!dequal(prevModifiers.current, modifiers)) {
			prevModifiers.current = modifiers
		}
		return prevModifiers.current!
	}, [modifiers])

	useEffect(() => {
		if (!popperInstanceRef.current || !enabled) return

		popperInstanceRef.current
			.setOptions({
				placement,
				strategy,
				modifiers: [...nextModifiers, updateModifier, disabledApplyStylesModifiers],
			})
			.catch((e) => new Error(`[popper] setOptions error, ${e}`))
	}, [enabled, nextModifiers, placement, strategy, updateModifier])

	useEffect(() => {
		if (!enabled || referenceElement == null || popperElement == null) {
			return undefined
		}

		popperInstanceRef.current = createPopper(referenceElement, popperElement, {
			...config,
			placement,
			strategy,
			modifiers: [...nextModifiers, ariaDescribedByModifier, updateModifier],
		})

		return () => {
			if (popperInstanceRef.current != null) {
				popperInstanceRef.current.destroy()
				popperInstanceRef.current = undefined

				setState((s) => ({
					...s,
					attributes: {},
					styles: { popper: {} },
				}))
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [enabled, referenceElement, popperElement])

	return popperState
}
