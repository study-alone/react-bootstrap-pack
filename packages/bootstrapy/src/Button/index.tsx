import clsx from 'clsx'
import { useButtonProps } from '@repo/restart-ui/Button'
import { useBootstrapPrefix } from '../hooks/useBootstrapPrefix'
import type { ButtonProps as BaseButtonProps } from '@repo/restart-ui/Button'
import type { BsPrefixProps, ButtonVariant } from '../types'

export { ButtonGroup, type ButtonGroupProps } from './ButtonGroup'

export interface ButtonProps extends BaseButtonProps, Omit<BsPrefixProps, 'as'> {
	active?: boolean
	variant?: ButtonVariant
	size?: 'sm' | 'lg'
	ref?: React.Ref<HTMLButtonElement>
}

export type CommonButtonProps = 'href' | 'size' | 'variant' | 'disabled'

export const Button = ({
	as,
	bsPrefix,
	variant = 'primary',
	size,
	active = false,
	disabled = false,
	className,
	ref,
	...restProps
}: ButtonProps) => {
	const prefix = useBootstrapPrefix(bsPrefix, 'btn')
	const [buttonProps, { tagName }] = useButtonProps({
		tagName: as,
		disabled,
		...restProps,
	})
	const Component = tagName

	return (
		<Component
			{...buttonProps}
			{...restProps}
			ref={ref}
			disabled={disabled}
			className={clsx(className, prefix, {
				active,
				[`${prefix}-${variant}`]: variant,
				[`${prefix}-${size}`]: size,
				disabled: restProps.href && disabled,
			})}
		/>
	)
}
