import clsx from 'clsx'
import { useBootstrapPrefix } from './hooks/useBootstrapPrefix'
import type { BsPrefixOnlyProps } from './types'

export interface ImageProps extends BsPrefixOnlyProps, React.ImgHTMLAttributes<HTMLImageElement> {
	fluid?: boolean
	rounded?: boolean
	roundedCircle?: boolean
	thumbnail?: boolean
	ref?: React.Ref<HTMLImageElement>
}

export const Image = ({
	bsPrefix,
	className,
	fluid = false,
	rounded = false,
	roundedCircle = false,
	thumbnail = false,
	ref,
	...props
}: ImageProps) => {
	bsPrefix = useBootstrapPrefix(bsPrefix, 'img')
	return (
		<img // eslint-disable-line jsx-a11y/alt-text
			ref={ref}
			{...props}
			className={clsx(
				className,
				fluid && `${bsPrefix}-fluid`,
				rounded && `rounded`,
				roundedCircle && `rounded-circle`,
				thumbnail && `${bsPrefix}-thumbnail`,
			)}
		/>
	)
}
