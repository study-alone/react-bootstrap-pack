import clsx from 'clsx'
import { Anchor, type AnchorProps } from '../Anchor'
import { useBootstrapPrefix } from '../hooks/useBootstrapPrefix'
import type { BsPrefixProps } from '../types'

export interface BreadcrumbItemProps
	extends BsPrefixProps,
		Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
	active?: boolean
	href?: string
	target?: string
	title?: React.ReactNode
	linkAs?: React.ElementType
	linkProps?: Record<string, unknown>
	link?:
		| {
				as?: React.ElementType
				props?: Record<string, unknown>
		  }
		| {
				as?: React.ComponentType<typeof Anchor>
				props?: AnchorProps
		  }
	ref?: React.Ref<HTMLElement>
}

export const BreadcrumbItem = ({
	bsPrefix,
	active = false,
	children,
	className,
	as: Component = 'li',
	linkAs: LinkComponent = Anchor,
	linkProps = {},
	href,
	title,
	target,
	ref,
	...restProps
}: BreadcrumbItemProps) => {
	const prefix = useBootstrapPrefix(bsPrefix, 'breadcrumb-item')

	return (
		<Component
			ref={ref}
			{...restProps}
			className={clsx(prefix, className, { active })}
			aria-current={active ? 'page' : undefined}
		>
			{active ? (
				children
			) : (
				<LinkComponent {...linkProps} href={href} title={title} target={target}>
					{children}
				</LinkComponent>
			)}
		</Component>
	)
}
