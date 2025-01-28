import { useCallback, useMemo } from 'react'
import { useUncontrolled } from 'uncontrollable'
import clsx from 'clsx'
import { SelectableContext } from '@repo/restart-ui/SelectableContext'
import { useBootstrapPrefix } from '../hooks/useBootstrapPrefix'
import { NavbarBrand } from './NavbarBrand'
import { NavbarCollapse } from './NavbarCollapse'
import { NavbarOffcanvas } from './NavbarOffcanvas'
import { NavbarText } from './NavbarText'
import { NavbarToggle } from './NavbarToggle'

import { NavbarContext } from './NavbarContext'
import type { SelectCallback } from '@repo/restart-ui'

export type NavbarProps = Omit<React.HTMLAttributes<HTMLElement>, 'onSelect' | 'onToggle'> & {
	variant?: 'light' | 'dark'
	expand?: boolean | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
	bg?: string
	fixed?: 'top' | 'bottom'
	sticky?: 'top' | 'bottom'
	onToggle?(expanded: boolean): void
	onSelect?: SelectCallback
	collapseOnSelect?: boolean
	expanded?: boolean
	as?: React.ElementType
	bsPrefix?: string
} & React.ComponentProps<'nav'>

const NavbarComponent = ({ ref, ...restProps }: NavbarProps) => {
	const {
		bsPrefix: initialBsPrefix,
		expand = true,
		variant = 'light',
		bg,
		fixed,
		sticky,
		className,
		as: Component = 'nav',
		expanded,
		onToggle,
		onSelect,
		collapseOnSelect = false,
		...controlledProps
	} = useUncontrolled(restProps, {
		expanded: 'onToggle',
	})

	const bsPrefix = useBootstrapPrefix(initialBsPrefix, 'navbar')

	const handleCollapse = useCallback<SelectCallback>(
		(...args) => {
			onSelect?.(...args)
			if (collapseOnSelect && expanded) {
				onToggle?.(false)
			}
		},
		[collapseOnSelect, expanded, onSelect, onToggle],
	)

	/**
	 * 일부 거짓 양성 결과가 발생하지만 거짓 부정보다 나은 것 같습니다.
	 * 엄격한 `undefined` 검사를 사용하면 사용자가 실제로 역할을 원하지 않는 경우
	 * 해당 역할을 명시적으로 "null"로 지정할 수 있습니다.
	 */
	if (controlledProps.role === undefined && Component !== 'nav') {
		controlledProps.role = 'navigation'
	}

	let expandClass = `${bsPrefix}-expand`
	if (typeof expand === 'string') {
		expandClass = `${expandClass}-${expand}`
	}

	const navbarContext = useMemo(
		() => ({
			onToggle: () => onToggle?.(!expanded),
			bsPrefix,
			expanded: !!expanded,
			expand,
		}),
		[bsPrefix, expand, expanded, onToggle],
	)

	return (
		<NavbarContext.Provider value={navbarContext}>
			<SelectableContext.Provider value={handleCollapse}>
				<Component
					ref={ref}
					{...controlledProps}
					className={clsx(className, bsPrefix, {
						[expandClass]: expand,
						[`${bsPrefix}-${variant}`]: variant,
						[`bg-${bg}`]: bg,
						[`sticky-${sticky}`]: sticky,
						[`fixed-${fixed}`]: fixed,
					})}
				/>
			</SelectableContext.Provider>
		</NavbarContext.Provider>
	)
}

export const Navbar = Object.assign(NavbarComponent, {
	Brand: NavbarBrand,
	Collapse: NavbarCollapse,
	Offcanvas: NavbarOffcanvas,
	Text: NavbarText,
	Toggle: NavbarToggle,
})
