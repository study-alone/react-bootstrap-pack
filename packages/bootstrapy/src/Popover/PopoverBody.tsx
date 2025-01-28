import clsx from 'clsx'
import { useBootstrapPrefix } from '../hooks/useBootstrapPrefix'
import type { BsPrefixProps } from '../types'

export interface PopoverBodyProps extends BsPrefixProps, React.HTMLAttributes<HTMLElement> {
	ref?: React.Ref<HTMLElement>
}

export const PopoverBody = ({
	className,
	bsPrefix,
	as: Component = 'div',
	ref,
	...props
}: PopoverBodyProps) => {
	bsPrefix = useBootstrapPrefix(bsPrefix, 'popover-body')
	return <Component ref={ref} className={clsx(className, bsPrefix)} {...props} />
}
