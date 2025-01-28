import clsx from 'clsx'
import { useBootstrapPrefix } from '../hooks/useBootstrapPrefix'
import type { BsPrefixProps } from '../types'

export interface CardTextProps extends BsPrefixProps, React.HTMLAttributes<HTMLElement> {
	ref?: React.Ref<HTMLElement>
}

export const CardText = ({
	className,
	bsPrefix,
	as: Component = 'p',
	ref,
	...props
}: CardTextProps) => {
	bsPrefix = useBootstrapPrefix(bsPrefix, 'card-text')
	return <Component ref={ref} className={clsx(className, bsPrefix)} {...props} />
}
