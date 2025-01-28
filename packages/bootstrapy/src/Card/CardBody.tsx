import clsx from 'clsx'
import { useBootstrapPrefix } from '../hooks/useBootstrapPrefix'
import type { BsPrefixProps } from '../types'

export interface CardBodyProps extends BsPrefixProps, React.HTMLAttributes<HTMLElement> {
	ref?: React.Ref<HTMLElement>
}

export const CardBody = ({
	className,
	bsPrefix,
	as: Component = 'div',
	ref,
	...restProps
}: CardBodyProps) => {
	const prefix = useBootstrapPrefix(bsPrefix, 'card-body')

	return <Component ref={ref} className={clsx(className, prefix)} {...restProps} />
}
