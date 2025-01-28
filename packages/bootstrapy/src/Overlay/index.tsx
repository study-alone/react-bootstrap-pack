import { useEffect, useRef, useState } from 'react'
import {
	Overlay as BaseOverlay,
	type OverlayProps as BaseOverlayProps,
	type OverlayArrowProps,
	type OverlayInjectedProps as BaseOverlayInjectedProps,
} from '@repo/restart-ui/Overlay'
import { useEventCallback, useIsomorphicEffect, useMergedRefs } from '@repo/restart-hooks'
import { Fade } from '../Fade'
import { useOverlayOffset } from './useOverlayOffset'
import type { State } from '@repo/restart-ui/usePopper'
import type { TransitionType, Placement, PopperRef, RootCloseEvent } from '../types'

export interface OverlayInjectedProps extends BaseOverlayInjectedProps {
	arrowProps: Partial<OverlayArrowProps>
	show: boolean
	placement: Placement | undefined
	popper: PopperRef
	hasDoneInitialMeasure?: boolean
	// [prop: string]: any
}

export type OverlayChildren = (injected: OverlayInjectedProps) => React.ReactNode

type OmittedBaseOverlayProps = Omit<BaseOverlayProps, 'children' | 'transition' | 'rootCloseEvent'>

export interface OverlayProps extends OmittedBaseOverlayProps {
	children: OverlayChildren
	transition?: TransitionType
	placement?: Placement
	rootCloseEvent?: RootCloseEvent
}

function wrapRefs(props: BaseOverlayInjectedProps, arrowProps: Partial<OverlayArrowProps>) {
	const { ref } = props
	const { ref: aRef } = arrowProps

	props.ref = ref?.__wrapped || (ref.__wrapped = (r) => ref(r))
	arrowProps.ref = aRef?.__wrapped || (aRef!.__wrapped = (r) => aRef?.(r))
}

export const Overlay = ({
	children: overlay,
	transition = Fade,
	popperConfig = {},
	rootClose = false,
	placement = 'top',
	show: outerShow = false,
	ref,
	...outerProps
}: OverlayProps) => {
	const popperRef = useRef<Partial<PopperRef>>({})
	const [firstRenderedState, setFirstRenderedState] = useState<Partial<State> | null>(null)
	const [innerRef, modifiers] = useOverlayOffset(outerProps.offset)
	const mergedRef = useMergedRefs(ref, innerRef)

	const actualTransition = transition === true ? Fade : transition || undefined

	const handleFirstUpdate = useEventCallback((state: Partial<State>) => {
		setFirstRenderedState({ ...state })
		popperConfig?.onFirstUpdate?.(state)
	})

	useIsomorphicEffect(() => {
		if (firstRenderedState && outerProps.target) {
			// Must wait for target element to resolve before updating popper.
			popperRef.current.scheduleUpdate?.()
		}
	}, [firstRenderedState, outerProps.target])

	useEffect(() => {
		if (!outerShow) {
			setFirstRenderedState(null)
		}
	}, [outerShow])

	return (
		<BaseOverlay
			{...outerProps}
			ref={mergedRef}
			popperConfig={{
				...popperConfig,
				modifiers: modifiers.concat(popperConfig.modifiers || []),
				onFirstUpdate: handleFirstUpdate,
			}}
			transition={actualTransition}
			rootClose={rootClose}
			placement={placement}
			show={outerShow}
		>
			{(overlayProps, { arrowProps, popper: popperObj, show }) => {
				wrapRefs(overlayProps, arrowProps)
				// Need to get placement from popper object, handling case when overlay is flipped using 'flip' prop
				const updatedPlacement = popperObj?.placement
				const popper = Object.assign(popperRef.current, {
					state: popperObj?.state,
					scheduleUpdate: popperObj?.update,
					placement: updatedPlacement,
					outOfBoundaries:
						popperObj?.state?.modifiersData.hide?.isReferenceHidden || false,
					strategy: popperConfig.strategy,
				})

				const hasDoneInitialMeasure = !!firstRenderedState

				// if (typeof overlay === 'function') {
				return overlay({
					...overlayProps,
					placement: updatedPlacement,
					show,
					...(!transition && show && { className: 'show' }),
					popper,
					arrowProps,
					hasDoneInitialMeasure,
				})
				// }

				// return React.cloneElement(overlay as React.ReactElement, {
				// 	...overlayProps,
				// 	placement: updatedPlacement,
				// 	arrowProps,
				// 	popper,
				// 	hasDoneInitialMeasure,
				// 	className: classNames(
				// 		(overlay as React.ReactElement).props.className,
				// 		!transition && show && 'show',
				// 	),
				// 	style: {
				// 		...(overlay as React.ReactElement).props.style,
				// 		...overlayProps.style,
				// 	},
				// })
			}}
		</BaseOverlay>
	)
}
