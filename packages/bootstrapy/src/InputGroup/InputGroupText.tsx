import clsx from 'clsx'
import { useBootstrapPrefix } from '../hooks/useBootstrapPrefix'
import type { BsPrefixProps } from '../types'

export interface InputGroupTextProps extends BsPrefixProps, React.HTMLAttributes<HTMLElement> {
	ref?: React.Ref<HTMLElement>
}

export const InputGroupText = ({
	ref,
	className,
	bsPrefix,
	as: Component = 'span',
	...restProps
}: InputGroupTextProps) => {
	bsPrefix = useBootstrapPrefix(bsPrefix, 'input-group-text')

	return <Component ref={ref} className={clsx(className, bsPrefix)} {...restProps} />
}
