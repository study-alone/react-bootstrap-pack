import clsx from 'clsx'

export type CloseButtonVariant = 'white'

export interface CloseButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: CloseButtonVariant
	ref?: React.Ref<HTMLButtonElement>
}

export const CloseButton = ({
	className,
	variant,
	'aria-label': ariaLabel = 'Close',
	ref,
	...props
}: CloseButtonProps) => {
	return (
		<button
			ref={ref}
			type="button"
			className={clsx('btn-close', variant && `btn-close-${variant}`, className)}
			aria-label={ariaLabel}
			{...props}
		/>
	)
}
