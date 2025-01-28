import clsx from 'clsx'
import { useBootstrapPrefix } from '../hooks/useBootstrapPrefix'
import type { BsPrefixProps } from '../types'

export interface DropdownDividerProps extends BsPrefixProps, React.HTMLAttributes<HTMLElement> {
	ref?: React.Ref<HTMLElement>
}

export const DropdownDivider = ({
	ref,
	className,
	bsPrefix,
	as: Component = 'hr',
	role = 'separator',
	...restProps
}: DropdownDividerProps) => {
	bsPrefix = useBootstrapPrefix(bsPrefix, 'dropdown-divider')

	return <Component ref={ref} className={clsx(className, bsPrefix)} role={role} {...restProps} />
}
