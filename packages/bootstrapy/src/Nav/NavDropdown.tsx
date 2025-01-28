import clsx from 'clsx'
import { useBootstrapPrefix } from '../hooks/useBootstrapPrefix'
import { Dropdown, type DropdownProps } from '../Dropdown'
import { type DropdownMenuVariant } from '../Dropdown/DropdownMenu'
import { NavLink } from './NavLink'

export interface NavDropdownProps extends Omit<DropdownProps, 'title'> {
	title: React.ReactNode
	disabled?: boolean
	active?: boolean
	menuRole?: string
	renderMenuOnMount?: boolean
	rootCloseEvent?: 'click' | 'mousedown'
	menuVariant?: DropdownMenuVariant
	ref?: React.Ref<HTMLElement>
}

const NavDropdownComponent = ({
	id,
	title,
	children,
	bsPrefix,
	className,
	rootCloseEvent,
	menuRole,
	disabled,
	active,
	renderMenuOnMount,
	menuVariant,
	ref,
	...props
}: NavDropdownProps) => {
	/* NavItem has no additional logic, it's purely presentational. Can set nav item class here to support "as" */
	const navItemPrefix = useBootstrapPrefix(undefined, 'nav-item')

	return (
		<Dropdown ref={ref} {...props} className={clsx(className, navItemPrefix)}>
			<Dropdown.Toggle
				id={id}
				active={active}
				disabled={disabled}
				childBsPrefix={bsPrefix}
				component={NavLink}
				componentProps={{ eventKey: null }}
			>
				{title}
			</Dropdown.Toggle>

			<Dropdown.Menu
				role={menuRole}
				renderOnMount={renderMenuOnMount}
				rootCloseEvent={rootCloseEvent}
				variant={menuVariant}
			>
				{children}
			</Dropdown.Menu>
		</Dropdown>
	)
}

export const NavDropdown = Object.assign(NavDropdownComponent, {
	Item: Dropdown.Item,
	ItemText: Dropdown.ItemText,
	Divider: Dropdown.Divider,
	Header: Dropdown.Header,
})
