import clsx from 'clsx'
import { useBootstrapPrefix } from '../hooks/useBootstrapPrefix'
import type { BsPrefixProps } from '../types'

export interface CardFooterProps extends BsPrefixProps, React.HTMLAttributes<HTMLElement> {
	ref?: React.Ref<HTMLElement>
}

export const CardFooter = ({
	className,
	bsPrefix,
	as: Component = 'div',
	ref,
	...props
}: CardFooterProps) => {
	bsPrefix = useBootstrapPrefix(bsPrefix, 'card-footer')
	return <Component ref={ref} className={clsx(className, bsPrefix)} {...props} />
}
