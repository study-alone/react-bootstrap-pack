import { useEffect, useImperativeHandle, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import clsx from 'clsx'
import { activeElement, contains, canUseDOM, listen } from '@repo/dom-helper'
import { useMounted, usePrevious, useEventCallback } from '@repo/restart-hooks'
import { useWaitForDOMRef, type DOMContainer } from '../useWaitForDOMRef'
import { useWindow } from '../useWindow'
import { renderTransition, type TransitionHandler } from '../ImperativeTransition/renderTransition'
import { isEscKey } from '../utils'
import { ModalManager } from './ModalManager'
import { useModalManager } from './useModalManager'
import type { TransitionCallbacks, TransitionStatus } from '@repo/react-transition-group'

export interface ModalTransitionProps extends TransitionCallbacks {
	in?: boolean
	appear?: boolean
	unmountOnExit?: boolean
	nodeRef: React.RefObject<HTMLElement | null>
	children: (
		status: TransitionStatus,
		refProp: {
			ref: (node: HTMLElement) => void
			className?: string
		},
	) => React.ReactNode
}

export type ModalTransitionComponent = React.FC<ModalTransitionProps>

export interface RenderModalDialogProps extends React.RefAttributes<Element> {
	style: React.CSSProperties | undefined
	className: string | undefined
	tabIndex: number
	role: string
	'aria-modal': boolean | undefined
}

export interface RenderModalBackdropProps extends React.RefAttributes<HTMLDivElement> {
	onClick: (event: React.SyntheticEvent) => void
	className?: string
}

/*
  Modal props are split into a version with and without index signature so that you can fully use them in another projects
  This is due to Typescript not playing well with index signatures e.g. when using Omit
*/
export interface ModalProps extends TransitionCallbacks {
	role?: string
	style?: React.CSSProperties
	className?: string

	/**
	 * Set the visibility of the Modal
	 */
	show?: boolean
	/**
	 * A DOM element, a `ref` to an element, or function that returns either. The Modal is appended to it's `container` element.
	 *
	 */
	container?: DOMContainer
	/**
	 * A callback fired when the Modal is opening.
	 */
	onShow?: () => void
	/**
	 * A callback fired when either the backdrop is clicked, or the escape key is pressed.
	 *
	 * The `onHide` callback only signals intent from the Modal,
	 * you must actually set the `show` prop to `false` for the Modal to close.
	 */
	onHide?: () => void

	/**
	 * A ModalManager instance used to track and manage the state of open
	 * Modals. Useful when customizing how modals interact within a container
	 */
	manager?: ModalManager

	/**
	 * Include a backdrop component. A `static`backdrop
	 * will not trigger a Modal onHide when clicked.
	 */
	backdrop?: true | false | 'static'

	/**
	 * A function that returns the dialog component. Useful for custom
	 * rendering. **Note:** the component should make sure to apply the provided ref.
	 *
	 * ```js static
	 * renderDialog={props => <MyDialog {...props} />}
	 * ```
	 */
	renderDialog: (props: RenderModalDialogProps) => React.ReactNode
	/**
	 * A function that returns a backdrop component. Useful for custom
	 * backdrop rendering.
	 *
	 * ```js
	 *  renderBackdrop={props => <MyBackdrop {...props} />}
	 * ```
	 */
	renderBackdrop?: (props: RenderModalBackdropProps) => React.ReactNode
	/**
	 * A callback fired when the escape key, if specified in `keyboard`, is pressed.
	 *
	 * If preventDefault() is called on the keyboard event, closing the modal will be cancelled.
	 */
	onEscapeKeyDown?: (e: KeyboardEvent) => void
	/**
	 * A callback fired when the backdrop, if specified, is clicked.
	 */
	onBackdropClick?: (e: React.SyntheticEvent) => void

	/**
	 * Close the modal when escape key is pressed
	 */
	keyboard?: boolean

	/**
	 * A `react-transition-group` `<Transition/>` component used
	 * to control animations for the dialog component.
	 */
	transition?: ModalTransitionComponent

	/**
	 * A transition handler, called with the `show` state and dialog element.
	 * Should return a promise when the transition is complete
	 */
	runTransition?: TransitionHandler

	/**
	 * A `react-transition-group` `<Transition/>` component used
	 * to control animations for the backdrop components.
	 */
	backdropTransition?: ModalTransitionComponent

	/**
	 * A transition handler, called with the `show` state and backdrop element.
	 * Should return a promise when the transition is complete
	 */
	runBackdropTransition?: TransitionHandler

	/**
	 * When `true` The modal will automatically shift focus to itself when it opens, and
	 * replace it to the last focused element when it closes. This also
	 * works correctly with any Modal children that have the `autoFocus` prop.
	 *
	 * Generally this should never be set to `false` as it makes the Modal less
	 * accessible to assistive technologies, like screen readers.
	 */
	autoFocus?: boolean
	/**
	 * When `true` The modal will prevent focus from leaving the Modal while open.
	 *
	 * Generally this should never be set to `false` as it makes the Modal less
	 * accessible to assistive technologies, like screen readers.
	 */
	enforceFocus?: boolean

	/**
	 * When `true` The modal will restore focus to previously focused element once
	 * modal is hidden
	 */
	restoreFocus?: boolean

	/**
	 * Options passed to focus function when `restoreFocus` is set to `true`
	 *
	 * @link  https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus#Parameters
	 */
	restoreFocusOptions?: {
		preventScroll: boolean
	}

	ref?: React.Ref<ModalHandle>
}

export interface ModalHandle {
	dialog: HTMLElement | null
	backdrop: HTMLElement | null
	isTopModal: () => boolean
}

export const ModalComponent = ({
	show = false,
	role = 'dialog',
	className,
	style,
	backdrop = true,
	keyboard = true,
	onBackdropClick,
	onEscapeKeyDown,
	transition,
	runTransition,

	backdropTransition,
	runBackdropTransition,

	autoFocus = true,
	enforceFocus = true,
	restoreFocus = true,
	restoreFocusOptions,
	renderDialog,
	renderBackdrop = (props: RenderModalBackdropProps) => <div {...props} />,
	manager: providedManager,
	container: containerRef,
	onShow,
	onHide = () => {},

	onExit,
	onExited,
	onExiting,
	onEnter,
	onEntering,
	onEntered,

	ref,

	...restProps
}: ModalProps) => {
	const ownerWindow = useWindow()
	const container = useWaitForDOMRef(containerRef)
	const modal = useModalManager(providedManager)

	/** new */
	const nodeRefDialog = useRef<HTMLDivElement>(null as unknown as HTMLDivElement)
	const nodeRefBackdrop = useRef<HTMLDivElement>(null as unknown as HTMLDivElement)

	const isMounted = useMounted()
	const prevShow = usePrevious(show)
	const [exited, setExited] = useState(!show)
	const lastFocusRef = useRef<HTMLElement | null>(null)

	const removeFocusListenerRef = useRef<(() => void) | null>(null)
	const removeKeydownListenerRef = useRef<(() => void) | null>(null)

	useImperativeHandle(ref, () => modal, [modal])

	if (canUseDOM && !prevShow && show) {
		lastFocusRef.current = activeElement(ownerWindow?.document) as HTMLElement | null
	}

	const handleDocumentKeydown = useEventCallback((event: KeyboardEvent) => {
		if (keyboard && isEscKey(event) && modal.isTopModal()) {
			onEscapeKeyDown?.(event)

			if (!event.defaultPrevented) {
				onHide?.()
			}
		}
	})

	const handleEnforceFocus = useEventCallback(() => {
		if (!enforceFocus || !isMounted() || !modal.isTopModal()) {
			return
		}

		const currentActiveElement = activeElement(ownerWindow?.document)

		if (modal.dialog && currentActiveElement && !contains(modal.dialog, currentActiveElement)) {
			modal.dialog.focus()
		}
	})

	const handleShow = useEventCallback(() => {
		modal.add()

		removeKeydownListenerRef.current = listen(document, 'keydown', handleDocumentKeydown)
		removeFocusListenerRef.current = listen(
			document,
			'focus',
			() => window.setTimeout(handleEnforceFocus),
			true,
		)

		if (onShow) {
			onShow()
		}

		if (autoFocus) {
			const currentActiveElement = activeElement(
				modal.dialog?.ownerDocument ?? ownerWindow?.document,
			) as HTMLElement | null

			if (
				modal.dialog &&
				currentActiveElement &&
				!contains(modal.dialog, currentActiveElement)
			) {
				lastFocusRef.current = currentActiveElement
				modal.dialog.focus()
			}
		}
	})

	const handleHide = useEventCallback(() => {
		modal.remove()

		removeKeydownListenerRef.current?.()
		removeFocusListenerRef.current?.()

		if (restoreFocus) {
			lastFocusRef.current?.focus(restoreFocusOptions)
			lastFocusRef.current = null
		}
	})

	const handleBackdropClick = useEventCallback((event: React.SyntheticEvent) => {
		if (event.target !== event.currentTarget) {
			return
		}

		onBackdropClick?.(event)

		if (backdrop === true) {
			onHide()
		}
	})

	const handleHidden: TransitionCallbacks['onExited'] = () => {
		setExited(true)
		onExited?.()
	}

	useEffect(() => {
		if (exited) handleHide()
		if (show) {
			if (exited) setExited(false)
			if (container) handleShow()
		}

		return () => {
			handleHide()
		}
	}, [container, exited, handleHide, handleShow, show])

	if (!container) {
		return null
	}

	const dialogElement = renderTransition(transition, runTransition, {
		unmountOnExit: true,
		mountOnEnter: true,
		appear: true,
		in: !!show,
		onExit,
		onExiting,
		onExited: handleHidden,
		onEnter,
		onEntering,
		onEntered,
		nodeRef: nodeRefDialog,
		children: (status, { ref, className: childClassNames }) => {
			return renderDialog({
				role,
				ref: (innerRef: HTMLDivElement) => {
					modal.setDialogRef(innerRef)
					ref?.(innerRef)
				},
				// apparently only works on the dialog role element
				'aria-modal': role === 'dialog' ? true : undefined,
				...restProps,
				style,
				className: clsx(className, childClassNames as string),
				tabIndex: -1,
			})
		},
	})

	const backdropElement = renderTransition(backdropTransition, runBackdropTransition, {
		in: !!show,
		appear: true,
		mountOnEnter: true,
		unmountOnExit: true,
		nodeRef: nodeRefBackdrop,
		children: (status, { ref, className }) => {
			return renderBackdrop({
				ref: (innerRef: HTMLDivElement) => {
					modal.setBackdropRef(innerRef)
					ref?.(innerRef)
				},
				onClick: handleBackdropClick,
				className: clsx(className as string),
			})
		},
	})

	return createPortal(
		<>
			{backdropElement}
			{dialogElement}
		</>,
		container,
	)
}

export const Modal = Object.assign(ModalComponent, {
	Manager: ModalManager,
})
