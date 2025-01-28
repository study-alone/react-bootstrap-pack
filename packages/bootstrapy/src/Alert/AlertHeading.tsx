import clsx from 'clsx'
import { divWithClassName } from '../divWithClassName'
import { useBootstrapPrefix } from '../hooks/useBootstrapPrefix'
import type { BsPrefixProps } from '../types'

const DivStyledAsH4 = divWithClassName('h4', 'DivStyledAsH4')

export interface AlertHeadingProps extends BsPrefixProps, React.HTMLAttributes<HTMLElement> {
	ref?: React.Ref<HTMLElement>
}

export const AlertHeading = ({
	className,
	bsPrefix,
	as: Component = DivStyledAsH4,
	ref,
	...props
}: AlertHeadingProps) => {
	bsPrefix = useBootstrapPrefix(bsPrefix, 'alert-heading')
	return <Component ref={ref} className={clsx(className, bsPrefix)} {...props} />
}
