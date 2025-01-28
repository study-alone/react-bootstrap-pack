import clsx from 'clsx'
import { useBootstrapPrefix } from '../hooks/useBootstrapPrefix'
import type { BsPrefixProps } from '../types'

export interface CardLinkProps extends BsPrefixProps, React.AnchorHTMLAttributes<HTMLElement> {
	ref?: React.Ref<HTMLElement>
}

export const CardLink = ({
	className,
	bsPrefix,
	as: Component = 'a',
	ref,
	...props
}: CardLinkProps) => {
	bsPrefix = useBootstrapPrefix(bsPrefix, 'card-link')
	return <Component ref={ref} className={clsx(className, bsPrefix)} {...props} />
}
