import clsx from 'clsx'
import { useBootstrapPrefix } from '../hooks/useBootstrapPrefix'
import type { BsPrefixProps } from '../types'

export interface ModalBodyProps extends BsPrefixProps, React.HTMLAttributes<HTMLElement> {
	ref?: React.Ref<HTMLElement>
}

export const ModalBody = ({
	className,
	bsPrefix,
	as: Component = 'div',
	ref,
	...restProps
}: ModalBodyProps) => {
	const prefix = useBootstrapPrefix(bsPrefix, 'modal-body')

	return <Component ref={ref} className={clsx(className, prefix)} {...restProps} />
}
