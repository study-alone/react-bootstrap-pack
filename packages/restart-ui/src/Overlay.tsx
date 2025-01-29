import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useCallbackRef, useMergedRefs } from '@repo/restart-hooks'
import { mergeOptionsWithPopperConfig } from './mergeOptionsWithPopperConfig'
import { useWaitForDOMRef } from './useWaitForDOMRef'
import {
	type Placement,
	type UsePopperState,
	type Offset,
	type UsePopperOptions,
	type VirtualElement,
	usePopper,
} from './usePopper'
import { useRootClose } from './useRootClose'
import { renderTransition } from './ImperativeTransition/renderTransition'
import type { RootCloseOptions } from './useRootClose'
import type { DOMContainer } from './useWaitForDOMRef'
import type { TransitionCallbacks } from '@repo/react-transition-group'
import type { TransitionComponent } from './types'
import type { TransitionHandler } from './ImperativeTransition/useTransition'

// extends Record<string, any>
export interface OverlayArrowProps {
	ref: React.RefCallback<HTMLDivElement> & { __wrapped?: React.RefCallback<HTMLDivElement> }
	style: React.CSSProperties
}

export interface OverlayMetadata {
	show: boolean
	placement: Placement | undefined
	popper: UsePopperState | null
	arrowProps: Partial<OverlayArrowProps>
}

// extends Record<string, any>
export interface OverlayInjectedProps {
	ref: React.RefCallback<HTMLElement> & { __wrapped?: React.RefCallback<HTMLElement> }
	style: React.CSSProperties
	'aria-labelledby'?: string
}

export interface OverlayProps extends TransitionCallbacks {
	/**
	 * Enables the Popper.js `flip` modifier, allowing the Overlay to
	 * automatically adjust it's placement in case of overlap with the viewport or toggle.
	 * Refer to the [flip docs](https://popper.js.org/popper-documentation.html#modifiers..flip.enabled) for more info
	 */
	flip?: boolean

	/** Specify where the overlay element is positioned in relation to the target element */
	placement?: Placement

	/**
	 * Control offset of the overlay to the reference element.
	 * A convenience shortcut to setting `popperConfig.modfiers.offset`
	 */
	offset?: Offset

	/**
	 * Control how much space there is between the edge of the boundary element and overlay.
	 * A convenience shortcut to setting `popperConfig.modfiers.preventOverflow.padding`
	 */
	containerPadding?: number

	/**
	 * A set of popper options and props passed directly to react-popper's Popper component.
	 */
	popperConfig?: Omit<UsePopperOptions, 'placement'>

	/**
	 * A DOM Element, [Virtual Element](https://popper.js.org/docs/v2/virtual-elements/), Ref to an element, or
	 * function that returns either. The `target` element is where the overlay is positioned relative to.
	 */
	container?: DOMContainer

	/**
	 * A DOM Element, Ref to an element, or function that returns either. The `target` element is where
	 * the overlay is positioned relative to.
	 */
	target: DOMContainer<HTMLElement | VirtualElement>

	/**
	 * 오버레이의 노출 여부 설정
	 */
	show?: boolean

	/**
	 * A `react-transition-group` `<Transition/>` component
	 * used to animate the overlay as it changes visibility.
	 */
	transition?: TransitionComponent

	/**
	 * 다음과 같이 호출되는  transitionHandler show상태 및 오버레이 element.
	 * transition이 완료되면 Promise을 반환해야 합니다.
	 */
	runTransition?: TransitionHandler

	/**
	 * 숨기고 싶을 때 오버레이에 의해 실행되는 콜백입니다.
	 * `rootClose`가 `true`일 때 필수 입니다.
	 *
	 * @type func
	 */
	onHide?: (e: React.MouseEvent | React.KeyboardEvent | Event) => void

	/**
	 * 오버레이가 트리거되어야 하는지 지정 `onHide` 사용자가 오버레이 외부를 클릭할 때
	 */
	rootClose?: boolean

	/**
	 * RootCloseWrapper를 비활성화하려면 비활성화를 지정하십시오.
	 */
	rootCloseDisabled?: boolean

	/**
	 * 오버레이 transition을 위한 이벤트 지정
	 */
	rootCloseEvent?: RootCloseOptions['clickTrigger']

	/**
	 * 오버레이 element를 반환하는 렌더링 prop입니다.
	 */
	children: (props: OverlayInjectedProps, meta: OverlayMetadata) => React.ReactNode

	ref: React.RefCallback<HTMLElement>
}

/**
 * Built on top of `Popper.js`, the overlay component is
 * great for custom tooltip overlays.
 */
export const Overlay = ({
	flip,
	offset,
	placement,
	containerPadding,
	popperConfig = {},
	transition: Transition,
	runTransition,
	ref,
	...restProps
}: OverlayProps) => {
	const [rootElement, attachRef] = useCallbackRef<HTMLElement>()
	const [arrowElement, attachArrowRef] = useCallbackRef<Element>()
	const mergedRef = useMergedRefs<HTMLElement | null>(attachRef, ref)
	const innerNodeRef = useRef<HTMLElement>(null)

	const container = useWaitForDOMRef(restProps.container)
	const target = useWaitForDOMRef(restProps.target)

	const [exited, setExited] = useState(!restProps.show)

	const popper = usePopper(
		target,
		rootElement,
		mergeOptionsWithPopperConfig({
			placement,
			enableEvents: !!restProps.show,
			containerPadding: containerPadding || 5,
			flip,
			offset,
			arrowElement,
			popperConfig,
		}),
	)

	console.log('usePopper refs', { target, rootElement })

	console.log('usePopper options', {
		placement,
		enableEvents: !!restProps.show,
		containerPadding: containerPadding || 5,
		flip,
		offset,
		arrowElement,
		popperConfig,
	})

	const handleHidden: TransitionCallbacks['onExited'] = () => {
		setExited(true)

		if (restProps.onExited) {
			restProps.onExited()
		}
	}

	// 오버레이가 전환되는 동안 렌더링을 취소하지 마세요.
	const mountOverlay = restProps.show || !exited

	useRootClose(rootElement, restProps.onHide!, {
		disabled: !restProps.rootClose || restProps.rootCloseDisabled,
		clickTrigger: restProps.rootCloseEvent,
	})

	useEffect(() => {
		if (restProps.show && exited) {
			setExited(false)
		}
	}, [exited, restProps.show])

	if (!mountOverlay) {
		// 반드시 필요한게 아니라면 아무것도 노출하지 않습니다.
		return null
	}

	const { onExit, onExiting, onEnter, onEntering, onEntered } = restProps

	const child = renderTransition(Transition, runTransition, {
		in: !!restProps.show,
		appear: true,
		mountOnEnter: true,
		unmountOnExit: true,
		onExit,
		onExiting,
		onExited: handleHidden,
		onEnter,
		onEntering,
		onEntered,
		nodeRef: Transition ? innerNodeRef : undefined,
		children: (/*status, { ref: innerRef }*/) => {
			return restProps.children(
				{
					...popper.attributes.popper,
					style: popper.styles.popper as React.CSSProperties,
					ref: mergedRef,
				},
				{
					popper,
					show: !!restProps.show,
					arrowProps: {
						...popper.attributes.arrow,
						style: popper.styles.arrow as React.CSSProperties,
						ref: attachArrowRef,
					},
					placement,
				},
			)
		},
	})

	return container ? createPortal(child, container) : null
}
