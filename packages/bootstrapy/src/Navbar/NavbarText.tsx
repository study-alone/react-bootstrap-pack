import clsx from 'clsx'
import { useBootstrapPrefix } from '../hooks/useBootstrapPrefix'
import type { BsPrefixProps } from '../types'

export interface NavbarTextProps extends BsPrefixProps, React.HTMLAttributes<HTMLElement> {
	ref?: React.Ref<HTMLElement>
}

export const NavbarText = ({
	className,
	bsPrefix,
	as: Component = 'span',
	ref,
	...restProps
}: NavbarTextProps) => {
	const prefix = useBootstrapPrefix(bsPrefix, 'navbar-text')

	return <Component ref={ref} className={clsx(className, prefix)} {...restProps} />
}
