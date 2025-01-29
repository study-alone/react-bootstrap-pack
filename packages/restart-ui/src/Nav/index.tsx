import { useContext, useEffect, useRef } from 'react'
import { querySelectorAll } from '@repo/dom-helper'
import { useForceUpdate, useMergedRefs } from '@repo/restart-hooks'
import { SelectableContext, makeEventKey } from '../SelectableContext'
import { TabContext } from '../Tabs/TabContext'
import { dataAttr, dataProp } from '../dataKey'
import { NavContext } from './NavContext'
import { NavItem } from './NavItem'
import type { NavItemProps } from './NavItem'
import type { EventKey, SelectCallback } from '../types'
import type { UseNavItemOptions } from './useNavItem'

export type { UseNavItemOptions, NavItemProps }

const noop = () => ''

export interface NavProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onSelect'> {
	/**
	 * 현재 활성 NavItem에 대한 키입니다.
	 */
	activeKey?: EventKey

	/**
	 * 구성 요소를 렌더링하는 데 사용되는 요소입니다.
	 */
	as?: React.ElementType

	/**
	 * NavItem이 선택되면 실행되는 콜백입니다.
	 */
	onSelect?: SelectCallback

	ref?: React.Ref<HTMLElement>
}

const EVENT_KEY_ATTR = dataAttr('event-key')

const NavComponent = ({
	ref,
	as: Component = 'div',
	onSelect,
	activeKey,
	role,
	onKeyDown,
	...restProps
}: NavProps) => {
	// A ref and forceUpdate for refocus, b/c we only want to trigger when needed and
	// don't want to reset the set in the effect
	const forceUpdate = useForceUpdate()
	const needsRefocusRef = useRef(false)

	const parentOnSelect = useContext(SelectableContext)
	const tabContext = useContext(TabContext)

	let getControllerId, getControlledId

	if (tabContext) {
		role = role || 'tablist'
		activeKey = tabContext.activeKey
		// TODO: do we need to duplicate these?
		getControlledId = tabContext.getControlledId
		getControllerId = tabContext.getControllerId
	}

	const listNode = useRef<HTMLElement>(null)

	const getNextActiveTab = (offset: number) => {
		const currentListNode = listNode.current

		if (!currentListNode) return null

		const items = querySelectorAll(
			currentListNode,
			`[${EVENT_KEY_ATTR}]:not([aria-disabled=true])`,
		)

		const activeChild = currentListNode.querySelector<HTMLElement>(`[aria-selected=true]`)

		if (!activeChild || activeChild !== document.activeElement) return null

		const index = items.indexOf(activeChild)

		if (index === -1) return null

		let nextIndex = index + offset
		if (nextIndex >= items.length) nextIndex = 0
		if (nextIndex < 0) nextIndex = items.length - 1

		return items[nextIndex]
	}

	const handleSelect = (key: string | null, event: React.SyntheticEvent) => {
		if (key == null) return
		onSelect?.(key, event)
		parentOnSelect?.(key, event)
	}

	const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
		onKeyDown?.(event)

		if (!tabContext) {
			return
		}

		const nextActiveChildMap = new Map([
			['ArrowLeft', getNextActiveTab(-1)],
			['ArrowUp', getNextActiveTab(-1)],
			['ArrowRight', getNextActiveTab(1)],
			['ArrowDown', getNextActiveTab(1)],
		])
		const nextActiveChild = nextActiveChildMap.get(event.key)

		if (!nextActiveChild) return

		event.preventDefault()

		handleSelect(nextActiveChild.dataset[dataProp('EventKey')] || null, event)

		needsRefocusRef.current = true
		forceUpdate()
	}

	useEffect(() => {
		if (listNode.current && needsRefocusRef.current) {
			const activeChild = listNode.current.querySelector<HTMLElement>(
				`[${EVENT_KEY_ATTR}][aria-selected=true]`,
			)
			activeChild?.focus()
		}

		needsRefocusRef.current = false
	})

	const mergedRef = useMergedRefs(ref, listNode)
	// used by NavLink to determine it's role
	return (
		<SelectableContext value={handleSelect}>
			<NavContext
				value={{
					role, // NavLink에서 role을 결정하는 데 사용됩니다.
					activeKey: makeEventKey(activeKey),
					getControlledId: getControlledId || noop,
					getControllerId: getControllerId || noop,
				}}
			>
				<Component {...restProps} onKeyDown={handleKeyDown} ref={mergedRef} role={role} />
			</NavContext>
		</SelectableContext>
	)
}

export const Nav = Object.assign(NavComponent, {
	Item: NavItem,
})
