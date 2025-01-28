import { useContext } from 'react'
import warning from 'warning'
import clsx from 'clsx'
import { useDropdownMenu, type UseDropdownMenuOptions } from '@repo/restart-ui/Dropdown'
import { useIsomorphicEffect, useMergedRefs } from '@repo/restart-hooks'
import { NavbarContext } from '../Navbar/NavbarContext'
import { useBootstrapPrefix } from '../hooks/useBootstrapPrefix'
import { InputGroupContext } from '../InputGroup/InputGroupContext'
import { DropdownContext } from './DropdownContext'
import { getDropdownMenuPlacement } from './getDropdownMenuPlacement'
import type {
	AlignDirection,
	AlignType,
	BsPrefixProps,
	Placement,
	ResponsiveAlignProp,
} from '../types'

export type DropdownMenuVariant = 'dark'

export interface DropdownMenuProps extends BsPrefixProps, React.HTMLAttributes<HTMLElement> {
	show?: boolean
	renderOnMount?: boolean
	flip?: boolean
	align?: AlignType
	rootCloseEvent?: 'click' | 'mousedown'
	popperConfig?: UseDropdownMenuOptions['popperConfig']
	variant?: DropdownMenuVariant
	ref?: React.Ref<HTMLElement>
	'x-placement'?: Placement
}

export const DropdownMenu = ({
	bsPrefix,
	className,
	align,
	rootCloseEvent,
	flip = true,
	show: showProps,
	renderOnMount,
	// for styled component
	as: Component = 'div',
	popperConfig,
	variant,
	ref,
	...restProps
}: DropdownMenuProps) => {
	let alignEnd = false
	const isNavbar = useContext(NavbarContext)
	const prefix = useBootstrapPrefix(bsPrefix, 'dropdown-menu')
	const { align: contextAlign, drop, isRTL } = useContext(DropdownContext)
	align = align || contextAlign
	const isInputGroup = useContext(InputGroupContext)

	const alignClasses: string[] = []

	if (align) {
		if (typeof align === 'object') {
			const keys = Object.keys(align) as AlignType[]

			warning(
				keys.length === 1,
				'There should only be 1 breakpoint when passing an object to `align`',
			)

			if (keys.length) {
				const brkPoint = keys[0] as keyof ResponsiveAlignProp
				const direction: AlignDirection = align[brkPoint]

				// dropdown-menu-end는 왼쪽 정렬 클래스 외에도 왼쪽을 반응형으로 정렬하는 데 필요합니다.
				alignEnd = direction === 'start'
				alignClasses.push(`${prefix}-${brkPoint as string}-${direction as string}`)
			}
		} else if (align === 'end') {
			alignEnd = true
		}
	}

	const placement = getDropdownMenuPlacement(alignEnd, drop, isRTL)

	const [menuProps, { hasShown, popper, show, toggle }] = useDropdownMenu({
		flip,
		rootCloseEvent,
		show: showProps,
		usePopper: !isNavbar && alignClasses.length === 0,
		offset: [0, 2],
		popperConfig,
		placement,
	})

	menuProps.ref = useMergedRefs(ref, menuProps.ref)

	useIsomorphicEffect(() => {
		// renderOnMount=true일 때 Popper의 메뉴 초기 위치가 올바르지 않습니다.
		// update()를 호출하여 수정해야 합니다.
		if (show) popper?.update()
	}, [popper, show])

	if (!hasShown && !renderOnMount && !isInputGroup) return null

	// custom component의 경우 추가적인 DOM이 아닌 props를 제공합니다.
	if (typeof Component !== 'string') {
		menuProps.show = show
		menuProps.close = () => toggle?.(false)
		menuProps.align = align
	}

	let style = restProps.style
	if (popper?.placement) {
		// 기본적인 팝퍼 스타일은 필요하지 않으며,
		// 메뉴가 표시되지 않을 때는 display: none으로 설정합니다.
		style = { ...restProps.style, ...menuProps.style }
		restProps['x-placement'] = popper.placement
	}

	return (
		<Component
			{...restProps}
			{...menuProps}
			style={style}
			// Bootstrap css에서는 반응형 메뉴의 스타일을 지정하기 위해 이 데이터 속성이 필요합니다.
			{...((alignClasses.length || isNavbar) && {
				'data-bs-popper': 'static',
			})}
			className={clsx(className, prefix, ...alignClasses, {
				show,
				[`${prefix}-end`]: alignEnd,
				[`${prefix}-${variant}`]: variant,
			})}
		/>
	)
}
