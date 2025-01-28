import { useUncontrolled } from 'uncontrollable'
import { useContext, useMemo } from 'react'
import clsx from 'clsx'
import { Dropdown as BaseDropdown } from '@repo/restart-ui/Dropdown'
import { useEventCallback } from '@repo/restart-hooks'
import { useBootstrapPrefix } from '../hooks/useBootstrapPrefix'
import { useIsRTL } from '../hooks/useIsRTL'
import { InputGroupContext } from '../InputGroup/InputGroupContext'
import { getDropdownMenuPlacement } from './getDropdownMenuPlacement'
import { DropdownContext, type DropDirection } from './DropdownContext'
import { DropdownToggle } from './DropdownToggle'
import { DropdownMenu } from './DropdownMenu'
import { DropdownItem } from './DropdownItem'
import { DropdownItemText } from './DropdownItemText'
import { DropdownDivider } from './DropdownDivider'
import { DropdownHeader } from './DropdownHeader'
import type { DropdownProps as BaseDropdownProps, ToggleMetadata } from '@repo/restart-ui/Dropdown'
import type { AlignType, BsPrefixProps } from '../types'

export interface DropdownProps
	extends BaseDropdownProps,
		BsPrefixProps,
		Omit<React.HTMLAttributes<HTMLElement>, 'onSelect' | 'children' | 'onToggle'> {
	drop?: DropDirection
	align?: AlignType
	focusFirstItemOnShow?: boolean | 'keyboard'
	navbar?: boolean
	autoClose?: boolean | 'outside' | 'inside'
	ref?: React.Ref<HTMLElement>
}

const DropdownComponent = ({ ref, ...props }: DropdownProps) => {
	const {
		bsPrefix,
		drop = 'down',
		show,
		className,
		align = 'start',
		onSelect,
		onToggle,
		focusFirstItemOnShow,
		// for styled-component
		as: Component = 'div',
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		navbar: _4,
		autoClose = true,
		...restProps
	} = useUncontrolled(props, { show: 'onToggle' })

	const isInputGroup = useContext(InputGroupContext)
	const prefix = useBootstrapPrefix(bsPrefix, 'dropdown')
	const isRTL = useIsRTL()

	const isClosingPermitted = (source?: string) => {
		// autoClose=false는 버튼 클릭 시에만 닫기를 허용합니다.
		if (autoClose === false) return source === 'click'

		// autoClose=inside는 rootClose에서 닫기를 허용하지 않습니다.
		if (autoClose === 'inside') return source !== 'rootClose'

		// autoClose=outside는 선택 시 닫기를 허용하지 않습니다.
		if (autoClose === 'outside') return source !== 'select'

		return true
	}

	const handleToggle = useEventCallback((nextShow: boolean, meta: ToggleMetadata) => {
		// 이벤트 대상이 ToggleButton인지 확인하고, 그렇다면 mousedown 이벤트를 무효화합니다.
		const isToggleButton = (meta.originalEvent?.target as HTMLElement).classList.contains(
			'dropdown-toggle',
		)

		if (isToggleButton && meta.source === 'mousedown') {
			return
		}

		if (
			(meta.originalEvent?.currentTarget === document && meta.source !== 'keydown') ||
			(meta.originalEvent as KeyboardEvent).key === 'Escape'
		) {
			meta.source = 'rootClose'
		}

		if (isClosingPermitted(meta.source)) {
			onToggle?.(nextShow, meta)
		}
	})

	const alignEnd = align === 'end'
	const placement = getDropdownMenuPlacement(alignEnd, drop, isRTL)

	const contextValue = useMemo(
		() => ({
			align,
			drop,
			isRTL,
		}),
		[align, drop, isRTL],
	)

	const directionClasses = {
		down: prefix,
		'down-centered': `${prefix}-center`,
		up: 'dropup',
		'up-centered': 'dropup-center dropup',
		end: 'dropend',
		start: 'dropstart',
	}

	return (
		<DropdownContext value={contextValue}>
			<BaseDropdown
				placement={placement}
				show={show}
				onSelect={onSelect}
				onToggle={handleToggle}
				focusFirstItemOnShow={focusFirstItemOnShow}
				itemSelector={`.${prefix}-item:not(.disabled):not(:disabled)`}
			>
				{isInputGroup ? (
					restProps.children
				) : (
					<Component
						{...restProps}
						ref={ref}
						className={clsx(className, directionClasses[drop], {
							show,
						})}
					/>
				)}
			</BaseDropdown>
		</DropdownContext>
	)
}

export const Dropdown = Object.assign(DropdownComponent, {
	Toggle: DropdownToggle,
	Menu: DropdownMenu,
	Item: DropdownItem,
	ItemText: DropdownItemText,
	Divider: DropdownDivider,
	Header: DropdownHeader,
})
