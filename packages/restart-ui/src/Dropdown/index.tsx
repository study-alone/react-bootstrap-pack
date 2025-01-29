import { useCallback, useRef, useEffect, useMemo, useContext } from 'react'
import { useUncontrolledProp } from 'uncontrollable'
import {
	usePrevious,
	useEventListener,
	useEventCallback,
	useForceUpdate,
} from '@repo/restart-hooks'
import { querySelectorAll } from '@repo/dom-helper'
import { SelectableContext } from '../SelectableContext'
import { dataAttr } from '../dataKey'
import { useWindow } from '../useWindow'
import { DropdownContext } from './DropdownContext'
import { DropdownMenu } from './DropdownMenu'
import { DropdownToggle } from './DropdownToggle'
import { isRoleMenu } from './isRoleMenu'
import { DropdownItem } from './DropdownItem'
import type { DropdownItemProps } from './DropdownItem'
import type { DropdownToggleProps } from './DropdownToggle'
import type { UseDropdownToggleMetadata } from './useDropdownToggle'
import type {
	DropdownMenuProps,
	UseDropdownMenuMetadata,
	UseDropdownMenuOptions,
} from './DropdownMenu'
import type { SelectCallback } from '../types'
import type { Placement } from '../usePopper'

export { useDropdownItem } from './DropdownItem'
export { useDropdownMenu } from './DropdownMenu'
export { useDropdownToggle } from './useDropdownToggle'
export { DropdownContext } from './DropdownContext'

export type {
	DropdownMenuProps,
	UseDropdownMenuMetadata,
	UseDropdownMenuOptions,
	DropdownToggleProps,
	UseDropdownToggleMetadata,
	DropdownItemProps,
}

export interface DropdownInjectedProps {
	onKeyDown: React.KeyboardEventHandler
}

export type ToggleEvent = React.SyntheticEvent | KeyboardEvent | MouseEvent | Event

export interface ToggleMetadata {
	source: string | undefined
	originalEvent: ToggleEvent | undefined
}

export interface DropdownProps {
	/**
	 * The PopperJS placement for positioning the Dropdown menu in relation to
	 * its Toggle.
	 *
	 * @default 'bottom-start'
	 */
	placement?: Placement

	/**
	 * Sets the initial visibility of the Dropdown.
	 */
	defaultShow?: boolean

	/**
	 * Whether or not the Dropdown is visible.
	 *
	 * @controllable onToggle
	 */
	show?: boolean

	/**
	 * A callback fired when a DropdownItem has been selected.
	 */
	onSelect?: SelectCallback

	/**
	 * A callback fired when the Dropdown wishes to change visibility. Called with
	 * the requested `show` value, the DOM event, and the source that fired it:
	 * `'click'`,`'keydown'`,`'rootClose'`, or `'select'`.
	 *
	 * ```ts static
	 * function(
	 *   nextShow: boolean,
	 *   meta: ToggleMetadata,
	 * ): void
	 * ```
	 *
	 * @controllable show
	 */
	onToggle?: (nextShow: boolean, meta: ToggleMetadata) => void

	/**
	 * A css selector string that will return __focusable__ menu items.
	 * Selectors should be relative to the menu component:
	 * e.g. ` > li:not('.disabled')`
	 */
	itemSelector?: string

	/**
	 * Controls the focus behavior for when the Dropdown is opened. Set to
	 * `true` to always focus the first menu item, `keyboard` to focus only when
	 * navigating via the keyboard, or `false` to disable completely
	 *
	 * The Default behavior is `false` **unless** the Menu has a `role="menu"`
	 * where it will default to `keyboard` to match the recommended [ARIA Authoring
	 * practices](https://www.w3.org/TR/wai-aria-practices-1.1/#menubutton).
	 */
	focusFirstItemOnShow?: boolean | 'keyboard'

	/**
	 * A render prop that returns the root dropdown element. The `props`
	 * argument should spread through to an element containing _both_ the
	 * menu and toggle in order to handle keyboard events for focus management.
	 *
	 * @type {Function ({
	 *   props: {
	 *     onKeyDown: (SyntheticEvent) => void,
	 *   },
	 * }) => React.Element}
	 */
	children: React.ReactNode
}

const useRefWithUpdate = () => {
	const forceUpdate = useForceUpdate()
	const ref = useRef<HTMLElement | null>(null)
	const attachRef = useCallback((element: HTMLElement | null) => {
		ref.current = element
		// ensure that a menu set triggers an update for consumers
		forceUpdate()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return [ref, attachRef] as const
}

export const DropdownComponent = ({
	defaultShow,
	show: rawShow,
	onSelect,
	onToggle: rawOnToggle,
	itemSelector = `* [${dataAttr('dropdown-item')}]`,
	focusFirstItemOnShow,
	placement = 'bottom-start',
	children,
}: DropdownProps) => {
	const window = useWindow()
	const [show, onToggle] = useUncontrolledProp(rawShow, defaultShow, rawOnToggle)

	/**
	 * 가능한 한 빨리 값을 채우기 위해 useCallbackRef 대신 일반 참조를 사용합니다.
	 * 그렇지 않으면 상태 값이 설정되기 전에
	 * element에 focus를 맞추는 effect가 실행될 수 있습니다.
	 */
	const [menuRef, setMenu] = useRefWithUpdate()
	const menuElement = menuRef.current

	const [toggleRef, setToggle] = useRefWithUpdate()
	const toggleElement = toggleRef.current

	const lastShow = usePrevious(show)
	const lastSourceEvent = useRef<string | null>(null)
	const focusInDropdown = useRef(false)
	const onSelectContext = useContext(SelectableContext)

	const toggle = useCallback(
		(
			nextShow: boolean,
			event: ToggleEvent | undefined,
			source: string | undefined = event?.type,
		) => {
			onToggle(nextShow, { originalEvent: event, source })
		},
		[onToggle],
	)

	const handleSelect = useEventCallback((key: string | null, event: React.SyntheticEvent) => {
		onSelect?.(key, event)
		toggle(false, event, 'select')

		if (!event.isPropagationStopped()) {
			onSelectContext?.(key, event)
		}
	})

	const context = useMemo(
		() => ({
			toggle,
			placement,
			show: !!show,
			menuElement,
			toggleElement,
			setMenu,
			setToggle,
		}),
		[menuElement, placement, setMenu, setToggle, show, toggle, toggleElement],
	)

	if (menuElement && lastShow && !show) {
		focusInDropdown.current = menuElement.contains(menuElement.ownerDocument.activeElement)
	}

	const focusToggle = useEventCallback(() => {
		if (toggleElement && toggleElement.focus) {
			toggleElement.focus()
		}
	})

	const maybeFocusFirst = useEventCallback(() => {
		const type = lastSourceEvent.current
		let focusType = focusFirstItemOnShow

		if (focusType == null) {
			focusType = menuRef.current && isRoleMenu(menuRef.current) ? 'keyboard' : false
		}

		if (focusType === false || (focusType === 'keyboard' && !/^key.+$/.test(type!))) {
			return
		}

		const first = querySelectorAll(menuRef.current!, itemSelector)[0]

		if (first && first.focus) {
			first.focus()
		}
	})

	useEffect(() => {
		if (show) {
			maybeFocusFirst?.()
		} else if (focusInDropdown.current) {
			focusInDropdown.current = false
			focusToggle?.()
		}
		// `show`만 변경해야 합니다.
	}, [focusToggle, maybeFocusFirst, show, focusInDropdown])

	useEffect(() => {
		lastSourceEvent.current = null
	}, [])

	const getNextFocusedChild = (current: HTMLElement, offset: number) => {
		if (!menuRef.current) {
			return null
		}

		const items = querySelectorAll(menuRef.current, itemSelector)

		let index = items.indexOf(current) + offset
		index = Math.max(0, Math.min(index, items.length))

		return items[index]
	}

	useEventListener(
		useCallback(() => window!.document, [window]),
		'keydown',
		(event: KeyboardEvent) => {
			const { key } = event
			const target = event.target as HTMLElement

			const fromMenu = menuRef.current?.contains(target)
			const fromToggle = toggleRef.current?.contains(target)

			// Second only to https://github.com/twbs/bootstrap/blob/8cfbf6933b8a0146ac3fbc369f19e520bd1ebdac/js/src/dropdown.js#L400
			// in inscrutability
			const isInput = /input|textarea/i.test(target.tagName)
			if (
				isInput &&
				(key == ' ' ||
					(key !== 'Escape' && fromMenu) ||
					(key === 'Escape' && (target as HTMLInputElement).type === 'search'))
			) {
				return
			}

			if (!fromMenu && !fromToggle) {
				return
			}

			if (key === 'Tab' && (!menuRef.current || !show)) {
				return
			}

			lastSourceEvent.current = event.type
			const meta = { originalEvent: event, source: event.type }

			switch (key) {
				case 'ArrowUp': {
					const next = getNextFocusedChild(target, -1)
					if (next && next.focus) {
						next.focus()
					}
					event.preventDefault()

					return
				}
				case 'ArrowDown': {
					event.preventDefault()
					if (!show) {
						onToggle(true, meta)
					} else {
						const next = getNextFocusedChild(target, 1)
						if (next && next.focus) {
							next.focus()
						}
					}
					return
				}
				case 'Tab': {
					/**
					 * 키를 누를 때 대상은 탭으로 이동한 요소이고,
					 * 해당 이벤트가 드롭다운(예: 이 메뉴)과 관련이 있는지 여부를 알아야 합니다.
					 * `keyup`에서 대상은 태그가 지정된 요소이며
					 * 이를 사용하여 포커스가 메뉴를 벗어났는지 확인합니다.
					 */
					target.ownerDocument.addEventListener(
						'keyup',
						(event) => {
							if (
								(event.key === 'Tab' && !event.target) ||
								!menuRef.current?.contains(event.target as HTMLElement)
							) {
								onToggle(false, meta)
							}
						},
						{ once: true },
					)
					break
				}
				case 'Escape': {
					if (key === 'Escape') {
						event.preventDefault()
						event.stopPropagation()
					}

					onToggle(false, meta)
					break
				}
			}
		},
	)

	return (
		<SelectableContext value={handleSelect}>
			<DropdownContext value={context}>{children}</DropdownContext>
		</SelectableContext>
	)
}

export const Dropdown = Object.assign(DropdownComponent, {
	Menu: DropdownMenu,
	Toggle: DropdownToggle,
	Item: DropdownItem,
})
