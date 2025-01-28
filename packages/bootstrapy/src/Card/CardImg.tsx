import clsx from 'clsx'
import { useBootstrapPrefix } from '../hooks/useBootstrapPrefix'
import type { BsPrefixProps } from '../types'

export interface CardImgProps extends BsPrefixProps, React.ImgHTMLAttributes<HTMLImageElement> {
	variant?: 'top' | 'bottom'
	ref?: React.Ref<HTMLImageElement>
}

export const CardImg =
	// Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
	({ bsPrefix, className, variant, as: Component = 'img', ref, ...restProps }: CardImgProps) => {
		const prefix = useBootstrapPrefix(bsPrefix, 'card-img')

		return (
			<Component
				ref={ref}
				className={clsx(variant ? `${prefix}-${variant}` : prefix, className)}
				{...restProps}
			/>
		)
	}
