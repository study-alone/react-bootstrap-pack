import clsx from 'clsx'
import { useBootstrapPrefix } from '../hooks/useBootstrapPrefix'
import { divWithClassName } from '../divWithClassName'
import type { BsPrefixProps } from '../types'

export interface CardSubtitleProps extends BsPrefixProps, React.HTMLAttributes<HTMLElement> {
	ref?: React.Ref<HTMLElement>
}

const DivStyledAsH6 = divWithClassName('h6')

export const CardSubtitle = ({
	className,
	bsPrefix,
	as: Component = DivStyledAsH6,
	ref,
	...props
}: CardSubtitleProps) => {
	bsPrefix = useBootstrapPrefix(bsPrefix, 'card-subtitle')
	return <Component ref={ref} className={clsx(className, bsPrefix)} {...props} />
}
