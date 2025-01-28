import clsx from 'clsx'
import { useBootstrapPrefix } from './hooks/useBootstrapPrefix'
import { Dropdown } from './Dropdown'
import { NavLink } from './Nav/NavLink'
import type { DropdownProps } from './Dropdown'
import type { DropdownMenuVariant } from './Dropdown/DropdownMenu'

export interface NavDropdownProps extends Omit<DropdownProps, 'title'> {
	title: React.ReactNode
	disabled?: boolean
	active?: boolean
	menuRole?: string
	renderMenuOnMount?: boolean
	rootCloseEvent?: 'click' | 'mousedown'
	menuVariant?: DropdownMenuVariant
}

const NavDropdownComponent = ({
	ref,
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
	...restProps
}: NavDropdownProps) => {
	// NavItem에는 추가 로직 없으며 순전히 프레젠테이션입니다.
	// 여기에서 "as"를 지원하도록 nav item 클래스를 설정할 수 있습니다.
	const navItemPrefix = useBootstrapPrefix(undefined, 'nav-item')

	return (
		<Dropdown ref={ref} {...restProps} className={clsx(className, navItemPrefix)}>
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
