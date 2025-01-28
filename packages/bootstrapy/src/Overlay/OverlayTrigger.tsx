import { contains } from '@repo/dom-helper'
import { useCallback, useRef } from 'react'
import { useTimeout, useMergedRefs } from '@repo/restart-hooks'
import warning from 'warning'
import { useUncontrolledProp } from 'uncontrollable'
import { Overlay } from './index'
import type { OverlayChildren, OverlayProps } from './index'
import type { Placement } from '../types'

export type OverlayTriggerType = 'hover' | 'click' | 'focus'

export type OverlayDelay = number | { show: number; hide: number }

export type OverlayInjectedProps = {
	onFocus?: React.FocusEventHandler<Element>
}

export type OverlayTriggerRenderProps = OverlayInjectedProps & {
	ref: React.Ref<Element>
}

export interface OverlayTriggerProps extends Omit<OverlayProps, 'children' | 'target'> {
	children: (props: OverlayTriggerRenderProps) => React.ReactNode
	trigger?: OverlayTriggerType | OverlayTriggerType[]
	delay?: OverlayDelay
	show?: boolean
	defaultShow?: boolean
	onToggle?: (nextShow: boolean) => void
	flip?: boolean
	overlay: OverlayChildren

	target?: never
	onHide?: never
	placement?: Placement
}

function normalizeDelay(delay?: OverlayDelay) {
	return delay && typeof delay === 'object'
		? delay
		: {
				show: delay,
				hide: delay,
			}
}

// Simple implementation of mouseEnter and mouseLeave.
// React's built version is broken: https://github.com/facebook/react/issues/4251
// for cases when the trigger is disabled and mouseOut/Over can cause flicker
// moving from one child element to another.
function handleMouseOverOut(
	handler: (...args: [React.MouseEvent<Element>, ...unknown[]]) => unknown,
	args: [React.MouseEvent<Element>, ...unknown[]],
) {
	const [event] = args
	const target = event.currentTarget
	const related = event.relatedTarget as Element

	if ((!related || related !== target) && !contains(target, related)) {
		handler(...args)
	}
}

export const OverlayTrigger = ({
	trigger = ['hover', 'focus'],
	overlay,
	children,
	popperConfig = {},

	show: propsShow,
	defaultShow = false,
	onToggle,

	delay: propsDelay,
	placement,
	flip = placement && placement.indexOf('auto') !== -1,
	ref,
	...props
}: OverlayTriggerProps) => {
	const triggerNodeRef = useRef(null)
	const mergedRef = useMergedRefs<unknown>(triggerNodeRef, ref)
	const timeout = useTimeout()
	const hoverStateRef = useRef<string>('')

	const [show, setShow] = useUncontrolledProp(propsShow, defaultShow, onToggle)

	const delay = normalizeDelay(propsDelay)

	// const { onFocus, onBlur, onClick } =
	// 	typeof children !== 'function' ? React.Children.only(children).props : ({} as any)

	const attachRef = (r: React.Component | Element | null | undefined) => {
		mergedRef(r)
	}

	const handleShow = useCallback(() => {
		timeout.clear()
		hoverStateRef.current = 'show'

		if (!delay.show) {
			setShow(true)
			return
		}

		timeout.set(() => {
			if (hoverStateRef.current === 'show') setShow(true)
		}, delay.show)
	}, [delay.show, setShow, timeout])

	const handleHide = useCallback(() => {
		timeout.clear()
		hoverStateRef.current = 'hide'

		if (!delay.hide) {
			setShow(false)
			return
		}

		timeout.set(() => {
			if (hoverStateRef.current === 'hide') setShow(false)
		}, delay.hide)
	}, [delay.hide, setShow, timeout])

	const handleFocus = useCallback<React.FocusEventHandler<Element>>(
		(...args) => {
			handleShow()
			// onFocus?.(...args)
		},
		[handleShow],
	)

	const handleBlur = useCallback(
		(...args: unknown[]) => {
			handleHide()
			// onBlur?.(...args)
		},
		[handleHide],
	)

	const handleClick = useCallback(
		(...args: unknown[]) => {
			setShow(!show)
			// onClick?.(...args)
		},
		[setShow, show],
	)

	const handleMouseOver = useCallback(
		(...args: [React.MouseEvent, ...unknown[]]) => {
			handleMouseOverOut(handleShow, args)
		},
		[handleShow],
	)

	const handleMouseOut = useCallback(
		(...args: [React.MouseEvent, ...unknown[]]) => {
			handleMouseOverOut(handleHide, args)
		},
		[handleHide],
	)

	const triggers: string[] =
		trigger == null
			? ([] as OverlayTriggerType[])
			: ([] as OverlayTriggerType[]).concat(trigger)

	const triggerProps: {
		onClick?: React.MouseEventHandler
		onFocus?: React.FocusEventHandler
		onBlur?: React.FocusEventHandler
		onMouseOver?: React.MouseEventHandler
		onMouseOut?: React.MouseEventHandler
		ref: React.RefCallback<React.Component | Element | null>
	} = {
		ref: attachRef,
	}

	if (triggers.indexOf('click') !== -1) {
		triggerProps.onClick = handleClick
	}

	if (triggers.indexOf('focus') !== -1) {
		triggerProps.onFocus = handleFocus
		triggerProps.onBlur = handleBlur
	}

	if (triggers.indexOf('hover') !== -1) {
		warning(
			triggers.length > 1,
			'[react-bootstrap] Specifying only the `"hover"` trigger limits the visibility of the overlay to just mouse users. Consider also including the `"focus"` trigger so that touch and keyboard only users can see the overlay as well.',
		)
		triggerProps.onMouseOver = handleMouseOver
		triggerProps.onMouseOut = handleMouseOut
	}

	return (
		<>
			{children(triggerProps)}
			<Overlay
				{...props}
				ref={ref}
				show={show}
				onHide={handleHide}
				flip={flip}
				placement={placement}
				popperConfig={popperConfig}
				target={triggerNodeRef.current}
			>
				{overlay}
			</Overlay>
		</>
	)
}
