import clsx from 'clsx'
import { divWithClassName } from '../divWithClassName'
import { useBootstrapPrefix } from '../hooks/useBootstrapPrefix'
import type { BsPrefixProps } from '../types'

const DivStyledAsH5 = divWithClassName('h5')

export interface CardTitleProps extends BsPrefixProps, React.HTMLAttributes<HTMLElement> {
	ref?: React.Ref<HTMLElement>
}

export const CardTitle = ({
	className,
	bsPrefix,
	as: Component = DivStyledAsH5,
	ref,
	...props
}: CardTitleProps) => {
	bsPrefix = useBootstrapPrefix(bsPrefix, 'card-title')
	return <Component ref={ref} className={clsx(className, bsPrefix)} {...props} />
}
