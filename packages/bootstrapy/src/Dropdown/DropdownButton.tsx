import { DropdownToggle, type PropsFromToggle } from './DropdownToggle'
import { DropdownMenu, type DropdownMenuVariant } from './DropdownMenu'
import { Dropdown, type DropdownProps } from './index'
import type { BsPrefixProps } from '../types'

export interface DropdownButtonProps
	extends Omit<DropdownProps, 'title'>,
		PropsFromToggle,
		BsPrefixProps {
	title: React.ReactNode
	menuRole?: string
	renderMenuOnMount?: boolean
	rootCloseEvent?: 'click' | 'mousedown'
	menuVariant?: DropdownMenuVariant
	flip?: boolean
	ref?: React.Ref<HTMLDivElement>
}

/**
 * A convenience component for simple or general use dropdowns. Renders a `Button` toggle and all `children`
 * are passed directly to the default `Dropdown.Menu`. This component accepts all of
 * [`Dropdown`'s props](#dropdown-props).
 *
 * _All unknown props are passed through to the `Dropdown` component._ Only
 * the Button `variant`, `size` and `bsPrefix` props are passed to the toggle,
 * along with menu-related props are passed to the `Dropdown.Menu`
 */
export const DropdownButton = ({
	title,
	children,
	bsPrefix,
	rootCloseEvent,
	variant,
	size,
	menuRole,
	renderMenuOnMount,
	disabled,
	href,
	id,
	menuVariant,
	flip,
	ref,
	...restProps
}: DropdownButtonProps) => {
	return (
		<Dropdown ref={ref} {...restProps}>
			<DropdownToggle
				id={id}
				href={href}
				size={size}
				variant={variant}
				disabled={disabled}
				childBsPrefix={bsPrefix}
			>
				{title}
			</DropdownToggle>
			<DropdownMenu
				role={menuRole}
				renderOnMount={renderMenuOnMount}
				rootCloseEvent={rootCloseEvent}
				variant={menuVariant}
				flip={flip}
			>
				{children}
			</DropdownMenu>
		</Dropdown>
	)
}
