import clsx from 'clsx'
import { useBootstrapPrefix } from '../hooks/useBootstrapPrefix'
import { FigureImage as Image, type FigureImageProps } from './FigureImage'
import { FigureCaption as Caption } from './FigureCaption'
import type { BsPrefixProps } from '../types'

export interface FigureProps extends BsPrefixProps, React.AnchorHTMLAttributes<HTMLElement> {
	ref?: React.Ref<HTMLElement>
}

const FigureComponent = ({
	className,
	bsPrefix,
	as: Component = 'figure',
	ref,
	...props
}: FigureProps) => {
	const prefix = useBootstrapPrefix(bsPrefix, 'figure')
	return <Component ref={ref} className={clsx(className, prefix)} {...props} />
}

export const Figure = Object.assign(FigureComponent, {
	Image: Image as React.ComponentType<FigureImageProps>,
	Caption,
})
