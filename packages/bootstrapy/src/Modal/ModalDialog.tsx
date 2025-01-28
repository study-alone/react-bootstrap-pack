import clsx from 'clsx'
import { useBootstrapPrefix } from '../hooks/useBootstrapPrefix'
import type { BsPrefixProps } from '../types'

export interface ModalDialogProps extends React.HTMLAttributes<HTMLDivElement>, BsPrefixProps {
	size?: 'sm' | 'lg' | 'xl'
	fullscreen?: true | 'sm-down' | 'md-down' | 'lg-down' | 'xl-down' | 'xxl-down'
	centered?: boolean
	scrollable?: boolean
	contentClassName?: string
	ref?: React.Ref<HTMLDivElement>
}

export const ModalDialog = ({
	bsPrefix,
	className,
	contentClassName,
	centered,
	size,
	fullscreen,
	children,
	scrollable,
	ref,
	...restProps
}: ModalDialogProps) => {
	bsPrefix = useBootstrapPrefix(bsPrefix, 'modal')
	const dialogClass = `${bsPrefix}-dialog`
	const fullscreenClass =
		typeof fullscreen === 'string'
			? `${bsPrefix}-fullscreen-${fullscreen}`
			: `${bsPrefix}-fullscreen`

	return (
		<div
			{...restProps}
			ref={ref}
			className={clsx(dialogClass, className, {
				[`${bsPrefix}-${size}`]: size,
				[`${dialogClass}-centered`]: centered,
				[`${dialogClass}-scrollable`]: scrollable,
				[fullscreenClass]: fullscreen,
			})}
		>
			<div className={clsx(`${bsPrefix}-content`, contentClassName)}>{children}</div>
		</div>
	)
}
