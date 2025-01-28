import clsx from 'clsx'
import { useBootstrapPrefix } from '../hooks/useBootstrapPrefix'
import type { BsPrefixProps } from '../types'

export interface NavbarBrandProps extends BsPrefixProps, React.HTMLAttributes<HTMLElement> {
	href?: string
	ref?: React.Ref<HTMLElement>
}

export const NavbarBrand = ({ bsPrefix, className, as, ref, ...restProps }: NavbarBrandProps) => {
	bsPrefix = useBootstrapPrefix(bsPrefix, 'navbar-brand')

	const Component = as || (restProps.href ? 'a' : 'span')

	return <Component {...restProps} ref={ref} className={clsx(className, bsPrefix)} />
}
