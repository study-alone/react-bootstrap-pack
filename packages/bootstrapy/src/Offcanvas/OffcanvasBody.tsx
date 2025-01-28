import clsx from 'clsx'
import { useBootstrapPrefix } from '../hooks/useBootstrapPrefix'
import type { BsPrefixProps } from '../types'

export interface OffcanvasBodyProps extends BsPrefixProps, React.HTMLAttributes<HTMLElement> {
	ref?: React.Ref<HTMLElement>
	as?: React.ElementType
}

export const OffcanvasBody = ({
	className,
	bsPrefix,
	as: Component = 'div',
	ref,
	...restProps
}: OffcanvasBodyProps) => {
	const prefix = useBootstrapPrefix(bsPrefix, 'offcanvas-body')

	return <Component ref={ref} className={clsx(className, prefix)} {...restProps} />
}
