import clsx from 'clsx'
import { divWithClassName } from '../divWithClassName'
import { useBootstrapPrefix } from '../hooks/useBootstrapPrefix'
import type { BsPrefixProps } from '../types'

const DivStyledAsH4 = divWithClassName('h4')

export interface ModalTitleProps extends BsPrefixProps, React.HTMLAttributes<HTMLElement> {
	ref?: React.Ref<HTMLElement>
}

export const ModalTitle = ({
	className,
	bsPrefix,
	as: Component = DivStyledAsH4,
	ref,
	...restProps
}: ModalTitleProps) => {
	const prefix = useBootstrapPrefix(bsPrefix, 'modal-title')

	return <Component ref={ref} className={clsx(className, prefix)} {...restProps} />
}
