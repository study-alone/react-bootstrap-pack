import clsx from 'clsx'
import { useBootstrapPrefix } from '../hooks/useBootstrapPrefix'
import type { BsPrefixProps } from '../types'

export interface CardGroupProps extends BsPrefixProps, React.HTMLAttributes<HTMLElement> {
	ref?: React.Ref<HTMLElement>
}

export const CardGroup = ({
	className,
	bsPrefix,
	as: Component = 'div',
	ref,
	...props
}: CardGroupProps) => {
	bsPrefix = useBootstrapPrefix(bsPrefix, 'card-group')
	return <Component ref={ref} className={clsx(className, bsPrefix)} {...props} />
}
