import clsx from 'clsx'
import { Image, type ImageProps } from '../Image'

export interface FigureImageProps extends ImageProps {
	ref?: React.Ref<HTMLImageElement>
}

export const FigureImage = ({ className, fluid = true, ref, ...restProps }: FigureImageProps) => (
	<Image ref={ref} {...restProps} fluid={fluid} className={clsx(className, 'figure-img')} />
)
