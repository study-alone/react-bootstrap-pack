import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import clsx from 'clsx'
import {
	Modal as BaseModal,
	type ModalProps as BaseModalProps,
	type ModalHandle,
	type ModalTransitionProps,
	type RenderModalBackdropProps,
	type RenderModalDialogProps,
} from '@repo/restart-ui/Modal'
import { useEventCallback, useBreakpoint } from '@repo/restart-hooks'
import { BootstrapModalManager, getSharedManager } from '../BootstrapModalManager'
import { ModalContext } from '../Modal/ModalContext'
import { Fade } from '../Fade'
import { useBootstrapPrefix } from '../hooks/useBootstrapPrefix'
import { OffcanvasToggling } from './OffcanvasToggling'
import { OffcanvasBody } from './OffcanvasBody'
import { OffcanvasHeader } from './OffcanvasHeader'
import { OffcanvasTitle } from './OffcanvasTitle'
import type { ResponsiveBreakpoint } from '../types'

interface BsDefaultProps extends React.HTMLAttributes<HTMLElement> {
	bsPrefix?: string
	as?: React.ElementType
}

export type OffcanvasPlacement = 'start' | 'end' | 'top' | 'bottom'

export interface OffcanvasProps
	extends Omit<
			BaseModalProps,
			'role' | 'renderBackdrop' | 'renderDialog' | 'transition' | 'backdropTransition'
		>,
		BsDefaultProps {
	bsPrefix?: string
	backdropClassName?: string
	scroll?: boolean
	placement?: OffcanvasPlacement
	responsive?: ResponsiveBreakpoint
	renderStaticNode?: boolean

	// @note instead BsPrefixForForwardingComponent
	ref?: React.Ref<ModalHandle>
	children: React.ReactNode
}

const DialogTransition = ({ children, ...props }: ModalTransitionProps) => {
	return (
		<OffcanvasToggling {...props}>
			{(status, innerProps) => {
				console.log('DialogTransition', { status, innerProps })
				return children(status, {
					...innerProps,
					ref: (node: HTMLElement) => {
						props.nodeRef.current = node
						innerProps.ref?.(node)
					},
				})
			}}
		</OffcanvasToggling>
	)
}

function BackdropTransition({ children, ...props }: ModalTransitionProps) {
	return (
		<Fade {...props} timeout={undefined}>
			{(status, innerProps) => {
				console.log('BackdropTransition', { status, innerProps })
				return children(status, {
					...innerProps,
					ref: (node: HTMLElement) => {
						props.nodeRef.current = node
						innerProps.ref?.(node)
					},
				})
			}}
		</Fade>
	)
}

const OffcanvasComponent = ({
	bsPrefix,
	className,
	children,
	'aria-labelledby': ariaLabelledby,
	placement = 'start',
	responsive,

	/** BaseModal Props */
	show = false,
	backdrop = true,
	keyboard = true,
	scroll = false,
	onEscapeKeyDown,
	onShow,
	onHide = () => {},
	container,
	autoFocus = true,
	enforceFocus = true,
	restoreFocus = true,
	restoreFocusOptions,
	onEnter = () => {},
	onEntering,
	onEntered,
	onExit,
	onExiting,
	onExited = () => {},
	backdropClassName,
	manager: propsManager,
	renderStaticNode = false,
	ref,
	...restProps
}: OffcanvasProps) => {
	const nodeRef = useRef<HTMLElement>(null)
	const modalManager = useRef<BootstrapModalManager>(null)
	const prefix = useBootstrapPrefix(bsPrefix, 'offcanvas')
	const [showOffcanvas, setShowOffcanvas] = useState(false)
	const handleHide = useEventCallback(onHide)

	const hideResponsiveOffcanvas = useBreakpoint(responsive || 'xs', 'up')

	useEffect(() => {
		// 반응형 오프캔버스가 표시되는 동안 화면 크기가 조정되는 경우를 처리합니다.
		// `responsive`가 제공되지 않으면 `show`만 사용하세요.
		setShowOffcanvas(responsive ? show && !hideResponsiveOffcanvas : show)
	}, [hideResponsiveOffcanvas, responsive, show])

	const modalContext = useMemo(
		() => ({
			onHide: handleHide,
		}),
		[handleHide],
	)

	const getModalManager = () => {
		if (propsManager) return propsManager
		if (scroll) {
			// Have to use a different modal manager since the shared one handles overflow.
			// 공유 모달 관리자는 오버플로를 처리하므로 다른 모달 관리자를 사용해야 합니다.
			if (!modalManager.current) {
				modalManager.current = new BootstrapModalManager({
					handleContainerOverflow: false,
				})

				return modalManager.current
			}

			return getSharedManager()
		}
	}

	const handleEnter = (isApperaring: boolean) => {
		if (nodeRef.current) {
			nodeRef.current.style.visibility = 'visible'
		}
		onEnter(isApperaring)
	}

	const handleExited = () => {
		if (nodeRef.current) {
			nodeRef.current.style.visibility = ''
		}
		onExited()
	}

	const renderBackdrop = useCallback(
		({ className: classNames, ...backdropProps }: RenderModalBackdropProps) => {
			console.log('@@@', backdropProps)
			return (
				<div
					{...backdropProps}
					className={clsx(`${prefix}-backdrop`, backdropClassName, classNames)}
				/>
			)
		},
		[backdropClassName, prefix],
	)

	const renderDialog = (dialogProps?: RenderModalDialogProps) => {
		return (
			<div
				{...dialogProps}
				{...restProps}
				ref={(node) => {
					nodeRef.current = node
					if (typeof dialogProps?.ref === 'function') {
						dialogProps?.ref?.(node)
					} else if (dialogProps?.ref) {
						dialogProps.ref.current = node
					}
				}}
				className={clsx(
					className,
					dialogProps?.className,
					responsive ? `${prefix}-${responsive}` : prefix,
					`${prefix}-${placement}`,
				)}
				aria-labelledby={ariaLabelledby}
			>
				{children}
			</div>
		)
	}

	/**
	 * Only render static elements when offcanvas isn't shown so we don't duplicate elements.
	 * 오프캔버스가 표시되지 않을 때만 정적 요소를 렌더링하여 요소를 중복하지 않습니다.
	 *
	 * TODO: Should follow bootstrap behavior and don't unmount children when show={false} in BaseModal.
	 * Will do this next major version.
	 * TODO: Bootstrap 동작을 따라야 하고 BaseModal에서 show={false}일 때
	 * 자식을 언마운트하지 않아야 합니다. 다음 주요 버전에서 이 작업을 수행할 것입니다.
	 */
	return (
		<>
			{!showOffcanvas && (responsive || renderStaticNode) && renderDialog()}

			<ModalContext value={modalContext}>
				<BaseModal
					show={showOffcanvas}
					ref={ref}
					backdrop={backdrop}
					container={container}
					keyboard={keyboard}
					// eslint-disable-next-line jsx-a11y/no-autofocus
					autoFocus={autoFocus}
					enforceFocus={enforceFocus && !scroll}
					restoreFocus={restoreFocus}
					restoreFocusOptions={restoreFocusOptions}
					onEscapeKeyDown={onEscapeKeyDown}
					onShow={onShow}
					onHide={handleHide}
					onEnter={handleEnter}
					onEntering={onEntering}
					onEntered={onEntered}
					onExit={onExit}
					onExiting={onExiting}
					onExited={handleExited}
					manager={getModalManager()}
					transition={DialogTransition}
					backdropTransition={BackdropTransition}
					renderBackdrop={renderBackdrop}
					renderDialog={renderDialog}
				/>
			</ModalContext>
		</>
	)
}

export const Offcanvas = Object.assign(OffcanvasComponent, {
	Body: OffcanvasBody,
	Header: OffcanvasHeader,
	Title: OffcanvasTitle,
})
