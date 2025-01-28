import clsx from 'clsx'
import { useBootstrapPrefix } from '../hooks/useBootstrapPrefix'
import type { BsPrefixProps } from '../types'

export interface FormFloatingProps extends BsPrefixProps, React.HTMLAttributes<HTMLElement> {
	ref?: React.Ref<HTMLElement>
}

export const FormFloating = ({
	ref,
	className,
	bsPrefix,
	as: Component = 'div',
	...restProps
}: FormFloatingProps) => {
	const prefix = useBootstrapPrefix(bsPrefix, 'form-floating')

	return <Component ref={ref} className={clsx(className, prefix)} {...restProps} />
}
