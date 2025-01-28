import clsx from 'clsx'
import { makeEventKey } from '@repo/restart-ui/SelectableContext'
import { Anchor } from '@repo/restart-ui/Anchor'
import { useNavItem } from '@repo/restart-ui/Nav/useNavItem'
import { useBootstrapPrefix } from '../hooks/useBootstrapPrefix'
import type { NavItemProps as BaseNavItemProps } from '@repo/restart-ui/Nav/NavItem'
import type { BsPrefixProps } from '../types'

export interface NavLinkProps extends BsPrefixProps, Omit<BaseNavItemProps, 'as'> {
	ref?: React.Ref<HTMLElement>
}

export const NavLink = ({
	bsPrefix,
	className,
	as: Component = Anchor,
	active,
	eventKey,
	disabled = false,
	ref,
	...props
}: NavLinkProps) => {
	bsPrefix = useBootstrapPrefix(bsPrefix, 'nav-link')

	const [navItemProps, meta] = useNavItem({
		key: makeEventKey(eventKey, props.href),
		active,
		disabled,
		...props,
	})

	return (
		<Component
			{...props}
			{...navItemProps}
			ref={ref}
			disabled={disabled}
			className={clsx(className, bsPrefix, {
				disabled,
				active: meta.isActive,
			})}
		/>
	)
}
