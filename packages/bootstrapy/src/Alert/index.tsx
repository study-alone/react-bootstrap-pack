import { useUncontrolled } from 'uncontrollable'
import clsx from 'clsx'
import { useEventCallback } from '@repo/restart-hooks'
import { CloseButton, type CloseButtonVariant } from '../CloseButton'
import { Fade } from '../Fade'
import { useBootstrapPrefix } from '../hooks/useBootstrapPrefix'
import { AlertHeading } from './AlertHeading'
import { AlertLink } from './AlertLink'
import type { TransitionType, Variant } from '../types'

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
	bsPrefix?: string
	variant?: Variant
	dismissible?: boolean
	show?: boolean
	onClose?: (flag: boolean, event: React.MouseEvent<Element, MouseEvent>) => void
	closeLabel?: string
	closeVariant?: CloseButtonVariant
	transition?: TransitionType
	ref: React.RefObject<HTMLDivElement | null>
}

export const Alert = ({ ref, ...uncontrolledProps }: AlertProps) => {
	const {
		bsPrefix,
		show = true,
		closeLabel = 'Close alert',
		closeVariant,
		className,
		children,
		variant = 'primary',
		onClose,
		dismissible,
		transition = Fade,
		...props
	} = useUncontrolled(uncontrolledProps, { show: 'onClose' })

	const prefix = useBootstrapPrefix(bsPrefix, 'alert')

	const handleClose = useEventCallback<[React.MouseEvent<Element>], void>((event) => {
		if (onClose) {
			onClose(false, event)
		}
	})

	const Transition = transition === true ? Fade : transition

	const renderAlert = (classNames: string = '', innerProps?: Record<string, unknown>) => {
		return (
			<div
				ref={ref}
				{...innerProps}
				role="alert"
				{...(!Transition ? props : undefined)}
				className={clsx(
					classNames,
					className,
					prefix,
					variant && `${prefix}-${variant}`,
					dismissible && `${prefix}-dismissible`,
				)}
			>
				{dismissible && (
					<CloseButton
						onClick={handleClose}
						aria-label={closeLabel}
						variant={closeVariant}
					/>
				)}
				{children}
			</div>
		)
	}

	if (!Transition) return show ? renderAlert() : null

	return (
		<Transition unmountOnExit {...props} in={show} nodeRef={ref}>
			{(status, { className, ...innerProps }) => renderAlert(className as string, innerProps)}
		</Transition>
	)
}

Alert.displayName = 'Alert'
Object.assign(Alert, {
	Link: AlertLink,
	Heading: AlertHeading,
})
