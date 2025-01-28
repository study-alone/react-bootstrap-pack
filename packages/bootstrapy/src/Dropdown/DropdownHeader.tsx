import clsx from 'clsx'
import { useBootstrapPrefix } from '../hooks/useBootstrapPrefix'
import type { BsPrefixProps } from '../types'

export interface DropdownHeaderProps extends BsPrefixProps, React.HTMLAttributes<HTMLElement> {
	ref?: React.Ref<HTMLElement>
}

export const DropdownHeader = ({
	ref,
	className,
	bsPrefix,
	as: Component = 'div',
	role = 'heading',
	...restProps
}: DropdownHeaderProps) => {
	bsPrefix = useBootstrapPrefix(bsPrefix, 'dropdown-header')

	return <Component ref={ref} className={clsx(className, bsPrefix)} role={role} {...restProps} />
}
