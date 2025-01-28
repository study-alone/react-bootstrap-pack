import clsx from 'clsx'
import { useBootstrapPrefix } from '../hooks/useBootstrapPrefix'
import { BreadcrumbItem } from './BreadcrumbItem'
import type { BsPrefixProps } from '../types'

export { BreadcrumbItem, type BreadcrumbItemProps } from './BreadcrumbItem'

export interface BreadcrumbProps extends BsPrefixProps, React.HTMLAttributes<HTMLElement> {
	label?: string
	listProps?: React.OlHTMLAttributes<HTMLOListElement>
	ref?: React.Ref<HTMLElement>
}

const BreadcrumbComponent = ({
	bsPrefix,
	className,
	listProps = {},
	children,
	label = 'breadcrumb',
	as: Component = 'nav',
	ref,
	...restProps
}: BreadcrumbProps) => {
	const prefix = useBootstrapPrefix(bsPrefix, 'breadcrumb')

	return (
		<Component aria-label={label} className={className} ref={ref} {...restProps}>
			<ol {...listProps} className={clsx(prefix, listProps?.className)}>
				{children}
			</ol>
		</Component>
	)
}

export const Breadcrumb = Object.assign(BreadcrumbComponent, {
	Item: BreadcrumbItem,
})
