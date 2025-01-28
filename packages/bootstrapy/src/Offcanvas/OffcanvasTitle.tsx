import clsx from 'clsx'
import { useBootstrapPrefix } from '../hooks/useBootstrapPrefix'
import { divWithClassName } from '../divWithClassName'
import type { BsPrefixProps } from '../types'

const DivStyledAsH5 = divWithClassName('h5')

export interface OffcanvasTitleProps extends BsPrefixProps, React.HTMLAttributes<HTMLElement> {
	ref?: React.Ref<HTMLElement>
}

export const OffcanvasTitle = ({
	className,
	bsPrefix,
	as: Component = DivStyledAsH5,
	ref,
	...restProps
}: OffcanvasTitleProps) => {
	const prefix = useBootstrapPrefix(bsPrefix, 'offcanvas-title')

	return <Component ref={ref} className={clsx(className, prefix)} {...restProps} />
}
