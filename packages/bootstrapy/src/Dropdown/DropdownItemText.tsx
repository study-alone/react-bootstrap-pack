import clsx from 'clsx'
import { useBootstrapPrefix } from '../hooks/useBootstrapPrefix'
import type { BsPrefixProps } from '../types'

export interface DropdownItemTextProps extends BsPrefixProps, React.HTMLAttributes<HTMLElement> {
	ref?: React.Ref<HTMLElement>
}

export const DropdownItemText = ({
	ref,
	className,
	bsPrefix,
	as: Component = 'span',
	...restProps
}: DropdownItemTextProps) => {
	bsPrefix = useBootstrapPrefix(bsPrefix, 'dropdown-item-text')

	return <Component ref={ref} className={clsx(className, bsPrefix)} {...restProps} />
}
