import clsx from 'clsx'
import { useBootstrapPrefix } from '../hooks/useBootstrapPrefix'
import { CardBody } from './CardBody'
import { CardImg } from './CardImg'
import { CardTitle } from './CardTitle'
import { CardSubtitle } from './CardSubtitle'
import { CardLink } from './CardLink'
import { CardText } from './CardText'
import { CardHeader } from './CardHeader'
import { CardFooter } from './CardFooter'
import { CardImgOverlay } from './CardImgOverlay'
import type { BsPrefixProps, Color, Variant } from '../types'

export interface CardProps extends BsPrefixProps, React.HTMLAttributes<HTMLElement> {
	bg?: Variant
	text?: Color
	border?: Variant
	body?: boolean
	ref?: React.Ref<HTMLElement>
}

export const CardComponent = ({
	bsPrefix,
	className,
	bg,
	text,
	border,
	body = false,
	children,
	as: Component = 'div',
	ref,
	...restProps
}: CardProps) => {
	const prefix = useBootstrapPrefix(bsPrefix, 'card')

	return (
		<Component
			ref={ref}
			{...restProps}
			className={clsx(className, prefix, {
				[`bg-${bg}`]: bg,
				[`text-${text}`]: text,
				[`border-${border}`]: border,
			})}
		>
			{body ? <CardBody>{children}</CardBody> : children}
		</Component>
	)
}

export const Card = Object.assign(CardComponent, {
	Img: CardImg,
	Title: CardTitle,
	Subtitle: CardSubtitle,
	Body: CardBody,
	Link: CardLink,
	Text: CardText,
	Header: CardHeader,
	Footer: CardFooter,
	ImgOverlay: CardImgOverlay,
})
