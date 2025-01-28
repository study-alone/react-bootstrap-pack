import clsx from 'clsx'
import { useBootstrapPrefix } from '../hooks/useBootstrapPrefix'
import type { BsPrefixProps } from '../types'

export interface ModalFooterProps extends BsPrefixProps, React.HTMLAttributes<HTMLElement> {
	ref?: React.Ref<HTMLElement>
}

export const ModalFooter = ({
	className,
	bsPrefix,
	as: Component = 'div',
	ref,
	...restProps
}: ModalFooterProps) => {
	const prefix = useBootstrapPrefix(bsPrefix, 'modal-footer')

	return <Component ref={ref} className={clsx(className, prefix)} {...restProps} />
}
