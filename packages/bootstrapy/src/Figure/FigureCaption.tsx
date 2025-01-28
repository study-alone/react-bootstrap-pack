import clsx from 'clsx'
import { useBootstrapPrefix } from '../hooks/useBootstrapPrefix'
import type { BsPrefixProps } from '../types'

export interface FigureCaptionProps extends BsPrefixProps, React.HTMLAttributes<HTMLElement> {
	ref?: React.Ref<HTMLElement>
}

export const FigureCaption = ({
	className,
	bsPrefix,
	as: Component = 'figcaption',
	ref,
	...props
}: FigureCaptionProps) => {
	const prefix = useBootstrapPrefix(bsPrefix, 'figure-caption')
	return <Component ref={ref} className={clsx(className, prefix)} {...props} />
}
