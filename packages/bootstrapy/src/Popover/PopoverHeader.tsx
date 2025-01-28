import clsx from 'clsx'
import { useBootstrapPrefix } from '../hooks/useBootstrapPrefix'
import type { BsPrefixProps } from '../types'

export interface PopoverHeaderProps extends BsPrefixProps, React.HTMLAttributes<HTMLElement> {
	ref?: React.Ref<HTMLElement>
}

export const PopoverHeader = ({
	className,
	bsPrefix,
	as: Component = 'div',
	ref,
	...props
}: PopoverHeaderProps) => {
	const prefix = useBootstrapPrefix(bsPrefix, 'popover-header')
	return <Component ref={ref} className={clsx(className, prefix)} {...props} />
}
