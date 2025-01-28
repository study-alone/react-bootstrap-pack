import { useContext } from 'react'
import { useEventCallback } from '@repo/restart-hooks'
import { dataAttr } from '../dataKey'
import { makeEventKey, SelectableContext } from '../SelectableContext'
import { NavContext } from '../Nav/NavContext'
import { Button } from '../Button'
import type { EventKey } from '../types'

export interface DropdownItemProps extends React.HTMLAttributes<HTMLElement> {
	/**
	 * Element used to render the component.
	 */
	as?: React.ElementType

	/**
	 * Highlight the menu item as active.
	 */
	active?: boolean

	/**
	 * Disable the menu item, making it unselectable.
	 */
	disabled?: boolean

	/**
	 * Value passed to the `onSelect` handler, useful for identifying the selected menu item.
	 */
	eventKey?: EventKey

	/**
	 * HTML `href` attribute corresponding to `a.href`.
	 */
	href?: string

	ref?: React.RefObject<typeof Button>
}

interface UseDropdownItemOptions {
	key?: EventKey | null
	href?: string
	active?: boolean
	disabled?: boolean
	onClick?: React.MouseEventHandler
}

/**
 * Create a dropdown item. Returns a set of props for the dropdown item component
 * including an `onClick` handler that prevents selection when the item is disabled
 */
export const useDropdownItem = ({
	key,
	href,
	active,
	disabled,
	onClick,
}: UseDropdownItemOptions) => {
	const onSelectContext = useContext(SelectableContext)
	const navContext = useContext(NavContext)

	const { activeKey } = navContext || {}
	const eventKey = makeEventKey(key, href)

	const isActive = active == null && key != null ? makeEventKey(activeKey) === eventKey : active

	const handleClick = useEventCallback((event: React.MouseEvent<Element, MouseEvent>) => {
		if (disabled) return

		onClick?.(event)

		if (onSelectContext && !event.isPropagationStopped()) {
			onSelectContext(eventKey, event)
		}
	})

	return [
		{
			onClick: handleClick,
			'aria-disabled': disabled || undefined,
			'aria-selected': isActive,
			[dataAttr('dropdown-item')]: '',
		},
		{ isActive },
	] as const
}

export const DropdownItem = ({
	eventKey,
	disabled,
	onClick,
	active,
	as: Component = Button,
	ref,
	...restProps
}: DropdownItemProps) => {
	const [dropdownItemProps] = useDropdownItem({
		key: eventKey,
		href: restProps.href,
		disabled,
		onClick,
		active,
	})

	return <Component {...restProps} ref={ref} {...dropdownItemProps} />
}
