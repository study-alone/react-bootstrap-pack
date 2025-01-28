import { useCallback, useEffect, useMemo, useRef, useState, type RefObject } from 'react'
import { canUseDOM, ownerDocument, scrollbarSize, transitionEnd } from '@repo/dom-helper'
import clsx from 'clsx'
import { useCallbackRef, useEventCallback, useMergedRefs } from '@repo/restart-hooks'
import { Modal as BaseModal } from '@repo/restart-ui/Modal'
import { useIsRTL } from '../hooks/useIsRTL'
import { useBootstrapPrefix } from '../hooks/useBootstrapPrefix'
import { getSharedManager } from '../BootstrapModalManager'
import { Fade } from '../Fade'
import { ModalDialog } from './ModalDialog'
import { ModalBody } from './ModalBody'
import { ModalHeader } from './ModalHeader'
import { ModalTitle } from './ModalTitle'
import { ModalFooter } from './ModalFooter'
import { ModalContext } from './ModalContext'
import type {
	ModalProps as BaseModalProps,
	ModalHandle,
	ModalTransitionProps,
	RenderModalBackdropProps,
	RenderModalDialogProps,
} from '@repo/restart-ui'
// import Fade from '@/bootstrap/original/Fade'

export type ModalProps = Omit<
	BaseModalProps,
	'role' | 'renderBackdrop' | 'renderDialog' | 'transition' | 'backdropTransition'
> & {
	size?: 'sm' | 'lg' | 'xl'
	fullscreen?: true | 'sm-down' | 'md-down' | 'lg-down' | 'xl-down' | 'xxl-down'
	bsPrefix?: string
	centered?: boolean
	backdropClassName?: string
	animation?: boolean
	dialogClassName?: string
	contentClassName?: string
	dialogAs?: React.ElementType
	scrollable?: boolean
	children?: React.ReactNode | undefined
	'data-bs-theme'?: string
	'aria-labelledby'?: string
	'aria-describedby'?: string
	'aria-label'?: string
	as?: React.ElementType
	ref?: React.Ref<ModalHandle>
	nodeRef: React.RefObject<HTMLElement | null>
}

function FadeTransition({ children, ...props }: ModalTransitionProps) {
	return (
		<Fade {...props} timeout={undefined}>
			{(status, innerProps) => {
				return children(status, {
					...innerProps,
					ref: (node: HTMLElement) => {
						if (props.nodeRef) {
							;(props.nodeRef as RefObject<HTMLElement>).current = node
						}
						innerProps.ref?.(node)
					},
				})
			}}
		</Fade>
	)
}

const ModalComponent = ({
	bsPrefix,
	className,
	style,
	children,
	dialogClassName,
	contentClassName,
	dialogAs: Dialog = ModalDialog,
	'data-bs-theme': dataBsTheme,
	'aria-labelledby': ariaLabelledby,
	'aria-describedby': ariaDescribedby,
	'aria-label': ariaLabel,

	/** BaseModal props */
	show = false,
	animation = true,
	backdrop = true,
	keyboard = true,
	onEscapeKeyDown,
	onShow,
	onHide = () => {},
	container,
	autoFocus = true,
	enforceFocus = true,
	restoreFocus = true,
	restoreFocusOptions,
	onEntered,
	onExit,
	onExiting,
	onEnter,
	onEntering,
	onExited,
	backdropClassName,
	manager: propsManager,
	ref,
	nodeRef,
	...restProps
}: ModalProps) => {
	const [modalStyle, setModalStyle] = useState({})
	const [animateStaticModal, setAnimateStaticModal] = useState(false)
	const waitingForMouseUpRef = useRef(false)
	const ignoreBackdropClickRef = useRef(false)
	const removeStaticModalAnimationRef = useRef<(() => void) | null>(null)
	const [modal, setModalRef] = useCallbackRef<ModalHandle>()
	// useImperativeHandle을 사용하여 변경해보자.
	const mergedRef = useMergedRefs(ref, setModalRef)
	const handleHide = useEventCallback(onHide)
	const isRTL = useIsRTL()

	bsPrefix = useBootstrapPrefix(bsPrefix, 'modal')

	const modalContext = useMemo(
		() => ({
			onHide: handleHide,
		}),
		[handleHide],
	)

	const getModalManager = () => {
		if (propsManager) return propsManager
		return getSharedManager({ isRTL })
	}

	const updateDialogStyle = (node: Element | null) => {
		if (!canUseDOM || node == null) return

		const containerIsOverflowing = getModalManager().getScrollbarWidth() > 0
		const modalIsOverflowing =
			node.scrollHeight > ownerDocument(node).documentElement.clientHeight

		setModalStyle({
			paddingRight:
				containerIsOverflowing && !modalIsOverflowing ? scrollbarSize(true) : undefined,
			paddingLeft:
				!containerIsOverflowing && modalIsOverflowing ? scrollbarSize(true) : undefined,
		})
	}

	const handleWindowResize = useEventCallback(() => {
		if (modal) {
			updateDialogStyle(modal.dialog)
		}
	})

	useEffect(() => {
		return () => {
			window.removeEventListener('resize', handleWindowResize)
			removeStaticModalAnimationRef.current?.()
		}
	}, [handleWindowResize])

	/**
	 * @note
	 * drag 중에 모달이 닫히는 것을 방지하기 위해
	 * click이 어디에서 시작되는지 감지합니다.
	 * 모달에서 시작해서 외부에서 끝나면 닫지 않습니다.
	 */
	const handleDialogMouseDown = () => {
		waitingForMouseUpRef.current = true
	}

	const handleMouseUp: React.MouseEventHandler = (event) => {
		if (waitingForMouseUpRef.current && modal && event.target === modal.dialog) {
			ignoreBackdropClickRef.current = true
		}
		waitingForMouseUpRef.current = false
	}

	const handleStaticModalAnimation = () => {
		setAnimateStaticModal(true)
		if (modal?.dialog) {
			removeStaticModalAnimationRef.current = transitionEnd(modal.dialog, () => {
				setAnimateStaticModal(false)
			})
		}
	}

	const handleStaticBackdropClick = (event: React.MouseEvent) => {
		if (event.target !== event.currentTarget) {
			return
		}

		handleStaticModalAnimation()
	}

	const handleClick = (event: React.MouseEvent) => {
		if (backdrop === 'static') {
			handleStaticBackdropClick(event)
			return
		}

		if (ignoreBackdropClickRef.current || event.target !== event.currentTarget) {
			ignoreBackdropClickRef.current = false
			return
		}

		onHide?.()
	}

	const handleEscapeKeyDown = (event: KeyboardEvent) => {
		if (keyboard) {
			onEscapeKeyDown?.(event)
		} else {
			/**
			 * @note
			 * @restart/ui에서 모달이 닫히는 것을 막으려면 preventDefault를 호출합니다.
			 */
			event.preventDefault()

			if (backdrop === 'static') {
				// play static modal animation
				handleStaticModalAnimation()
			}
		}
	}

	const handleEnter = (isAppearing: boolean) => {
		updateDialogStyle(nodeRef.current)

		onEnter?.(isAppearing)
	}

	const handleExit = () => {
		removeStaticModalAnimationRef.current?.()
		onExit?.()
	}

	const handleEntering = (isAppearing: boolean) => {
		onEntering?.(isAppearing)

		// FIXME: 애니메이션이 비활성화된 경우에도 이 기능이 작동해야 합니다.
		window.addEventListener('resize', handleWindowResize)
	}

	const handleExited = () => {
		if (nodeRef.current) {
			nodeRef.current.style.display = ''
		}
		onExited?.()

		// FIXME: 애니메이션이 비활성화된 경우에도 이 기능이 작동해야 합니다.
		window.removeEventListener('resize', handleWindowResize)
	}

	const renderBackdrop = useCallback(
		({ className, ...props }: RenderModalBackdropProps) => {
			return (
				<div
					{...props}
					className={clsx(`${bsPrefix}-backdrop`, backdropClassName, className, {
						show: !animation,
					})}
				/>
			)
		},
		[animation, backdropClassName, bsPrefix],
	)

	const baseModalStyle = { ...style, ...modalStyle }

	// `display`가 block으로 설정되지 않으면 모달 내부의 autoFocus가 실패합니다.
	/** @see https://github.com/react-bootstrap/react-bootstrap/issues/5102 */
	baseModalStyle.display = 'block'

	const renderDialog = ({
		className: childClassName,
		ref,
		...dialogProps
	}: RenderModalDialogProps) => {
		return (
			// eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
			<div
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				role="dialog"
				{...dialogProps}
				ref={(node) => {
					nodeRef.current = node
					if (typeof ref === 'function') {
						ref(node)
					} else if (ref) {
						ref.current = node
					}
				}}
				style={baseModalStyle}
				className={clsx(className, bsPrefix, childClassName, {
					[`${bsPrefix}-static`]: animateStaticModal,
					show: !animation,
				})}
				onClick={backdrop ? handleClick : undefined}
				onMouseUp={handleMouseUp}
				data-bs-theme={dataBsTheme}
				aria-label={ariaLabel}
				aria-labelledby={ariaLabelledby}
				aria-describedby={ariaDescribedby}
			>
				<Dialog
					{...restProps}
					onMouseDown={handleDialogMouseDown}
					className={dialogClassName}
					contentClassName={contentClassName}
				>
					{children}
				</Dialog>
			</div>
		)
	}

	return (
		<ModalContext.Provider value={modalContext}>
			<BaseModal
				show={show}
				ref={mergedRef}
				backdrop={backdrop}
				container={container}
				keyboard
				// eslint-disable-next-line jsx-a11y/no-autofocus
				autoFocus={autoFocus}
				enforceFocus={enforceFocus}
				restoreFocus={restoreFocus}
				restoreFocusOptions={restoreFocusOptions}
				onEscapeKeyDown={handleEscapeKeyDown}
				onShow={onShow}
				onHide={onHide}
				onEnter={handleEnter}
				onEntering={handleEntering}
				onEntered={onEntered}
				onExit={handleExit}
				onExiting={onExiting}
				onExited={handleExited}
				manager={getModalManager()}
				transition={animation ? FadeTransition : undefined}
				backdropTransition={animation ? FadeTransition : undefined}
				renderBackdrop={renderBackdrop}
				renderDialog={renderDialog}
			/>
		</ModalContext.Provider>
	)
}

export const Modal = Object.assign(ModalComponent, {
	Body: ModalBody,
	Header: ModalHeader,
	Title: ModalTitle,
	Footer: ModalFooter,
	Dialog: ModalDialog,
	TRANSITION_DURATION: 300,
	BACKDROP_TRANSITION_DURATION: 150,
})
