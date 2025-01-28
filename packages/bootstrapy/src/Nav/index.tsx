import { useContext } from 'react'
import { useUncontrolled } from 'uncontrollable'
import clsx from 'clsx'
import { Nav as BaseNav } from '@repo/restart-ui/Nav'
import { useBootstrapPrefix } from '../hooks/useBootstrapPrefix'
import { NavbarContext } from '../Navbar/NavbarContext'
import { CardHeaderContext } from '../Card/CardHeaderContext'
import { NavItem } from './NavItem'
import { NavLink } from './NavLink'
import type { BsPrefixProps } from '../types'
import type { NavProps as BaseNavProps } from '@repo/restart-ui/Nav'
import type { EventKey } from '@repo/restart-ui'

export interface NavProps extends BsPrefixProps, BaseNavProps {
	navbarBsPrefix?: string
	cardHeaderBsPrefix?: string
	variant?: 'tabs' | 'pills' | 'underline'
	defaultActiveKey?: EventKey
	fill?: boolean
	justify?: boolean
	navbar?: boolean
	navbarScroll?: boolean
	ref?: React.Ref<HTMLElement>
}

const NavComponent = ({ ref, ...props }: NavProps) => {
	const {
		as = 'div',
		bsPrefix: initialBsPrefix,
		variant,
		fill = false,
		justify = false,
		navbar,
		navbarScroll,
		className,
		activeKey,
		...restProps
	} = useUncontrolled(props, { activeKey: 'onSelect' })

	const bsPrefix = useBootstrapPrefix(initialBsPrefix, 'nav')

	let navbarBsPrefix
	let cardHeaderBsPrefix
	let isNavbar = false

	const navbarContext = useContext(NavbarContext)
	const cardHeaderContext = useContext(CardHeaderContext)

	if (navbarContext) {
		navbarBsPrefix = navbarContext.bsPrefix
		isNavbar = navbar == null ? true : navbar
	} else if (cardHeaderContext) {
		;({ cardHeaderBsPrefix } = cardHeaderContext)
	}

	return (
		<BaseNav
			as={as}
			ref={ref}
			activeKey={activeKey}
			className={clsx(className, {
				[bsPrefix]: !isNavbar,
				[`${navbarBsPrefix}-nav`]: isNavbar,
				[`${navbarBsPrefix}-nav-scroll`]: isNavbar && navbarScroll,
				[`${cardHeaderBsPrefix}-${variant}`]: !!cardHeaderBsPrefix,
				[`${bsPrefix}-${variant}`]: !!variant,
				[`${bsPrefix}-fill`]: fill,
				[`${bsPrefix}-justified`]: justify,
			})}
			{...restProps}
		/>
	)
}

export const Nav = Object.assign(NavComponent, {
	Item: NavItem,
	Link: NavLink,
})
