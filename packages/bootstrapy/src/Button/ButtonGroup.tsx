import clsx from 'clsx'
import { useBootstrapPrefix } from '../hooks/useBootstrapPrefix'
import type { BsPrefixProps } from '../types'

export interface ButtonGroupProps extends BsPrefixProps, React.HTMLAttributes<HTMLElement> {
	size?: 'sm' | 'lg'
	vertical?: boolean
	ref?: React.Ref<HTMLElement>
}

export const ButtonGroup = ({
	bsPrefix,
	size,
	vertical = false,
	className,
	role = 'group',
	as: Component = 'div',
	ref,
	...restProps
}: ButtonGroupProps) => {
	const prefix = useBootstrapPrefix(bsPrefix, 'btn-group')
	let baseClass = prefix

	if (vertical) baseClass = `${prefix}-vertical`

	return (
		<Component
			{...restProps}
			ref={ref}
			role={role}
			className={clsx(className, baseClass, {
				[`${prefix}-${size}`]: size,
			})}
		/>
	)
}
