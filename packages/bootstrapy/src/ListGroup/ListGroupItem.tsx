import clsx from 'clsx'
import warning from 'warning'
import { makeEventKey } from '@repo/restart-ui/SelectableContext'
import { useEventCallback } from '@repo/restart-hooks'
import { useNavItem } from '@repo/restart-ui/Nav/useNavItem'
import { useBootstrapPrefix } from '../hooks/useBootstrapPrefix'
import type { NavItemProps as BaseNavItemProps } from '@repo/restart-ui/Nav/NavItem'
import type { BsPrefixProps, Variant } from '../types'

export interface ListGroupItemProps extends BsPrefixProps, Omit<BaseNavItemProps, 'onSelect'> {
	action?: boolean
	onClick?: React.MouseEventHandler
	variant?: Variant
	ref?: React.Ref<HTMLElement>
}

export const ListGroupItem = ({
	bsPrefix,
	active,
	disabled,
	eventKey,
	className,
	variant,
	action,
	as,
	ref,
	...restProps
}: ListGroupItemProps) => {
	bsPrefix = useBootstrapPrefix(bsPrefix, 'list-group-item')

	const [navItemProps, meta] = useNavItem({
		key: makeEventKey(eventKey, restProps.href),
		active,
		...restProps,
	})

	const handleClick = useEventCallback((event: React.MouseEvent) => {
		if (disabled) {
			event.preventDefault()
			event.stopPropagation()
			return
		}

		;(navItemProps?.onClick as React.MouseEventHandler)(event)
	})

	if (disabled && restProps.tabIndex === undefined) {
		restProps.tabIndex = -1
		restProps['aria-disabled'] = true
	}

	const Component = as || (action ? (restProps.href ? 'a' : 'button') : 'div')

	warning(
		as || !(!action && restProps.href),
		'`action=false` and `href` should not be used together.',
	)

	return (
		<Component
			ref={ref}
			{...restProps}
			{...navItemProps}
			onClick={handleClick}
			className={clsx(className, bsPrefix, {
				active: meta.isActive,
				disabled,
				[`${bsPrefix}-${variant}`]: variant,
				[`${bsPrefix}-action`]: action,
			})}
		/>
	)
}
