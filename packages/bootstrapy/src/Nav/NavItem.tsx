import clsx from 'clsx'
import { useBootstrapPrefix } from '../hooks/useBootstrapPrefix'
import type { BsPrefixProps } from '../types'

export interface NavItemProps extends BsPrefixProps, React.HTMLAttributes<HTMLElement> {
	ref?: React.Ref<HTMLElement>
}

export const NavItem = ({
	className,
	bsPrefix,
	as: Component = 'div',
	ref,
	...props
}: NavItemProps) => {
	bsPrefix = useBootstrapPrefix(bsPrefix, 'nav-item')
	return <Component ref={ref} className={clsx(className, bsPrefix)} {...props} />
}
