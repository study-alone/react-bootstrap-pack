import clsx from 'clsx'
import { useBootstrapPrefix } from '../hooks/useBootstrapPrefix'
import type { BsPrefixProps } from '../types'

export interface CardImgOverlayProps extends BsPrefixProps, React.HTMLAttributes<HTMLElement> {
	ref?: React.Ref<HTMLElement>
}

export const CardImgOverlay = ({
	className,
	bsPrefix,
	as: Component = 'div',
	ref,
	...props
}: CardImgOverlayProps) => {
	bsPrefix = useBootstrapPrefix(bsPrefix, 'card-img-overlay')
	return <Component ref={ref} className={clsx(className, bsPrefix)} {...props} />
}
