import { useContext } from 'react'
import { useEventCallback } from '@repo/restart-hooks'
import { ModalContext } from './Modal/ModalContext'
import { CloseButton, type CloseButtonVariant } from './CloseButton'

export interface AbstractModalHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
	closeLabel?: string
	closeVariant?: CloseButtonVariant
	closeButton?: boolean
	onHide?: () => void
	ref?: React.Ref<HTMLDivElement>
}

export const AbstractModalHeader = ({
	closeLabel,
	closeButton,
	closeVariant,
	onHide,
	children,
	ref,
	...restProps
}: AbstractModalHeaderProps) => {
	const context = useContext(ModalContext)

	const handleClick = useEventCallback(() => {
		context?.onHide()
		onHide?.()
	})

	return (
		<div ref={ref} {...restProps}>
			{children}
			{closeButton && (
				<CloseButton aria-label={closeLabel} variant={closeVariant} onClick={handleClick} />
			)}
		</div>
	)
}
