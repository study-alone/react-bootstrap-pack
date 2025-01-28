import { useCallback, useContext } from 'react'
import { useSSRSafeId } from '../ssr'
import { isRoleMenu } from './isRoleMenu'
import { DropdownContext, type DropdownContextValue } from './DropdownContext'

const noop = () => {}

export interface UseDropdownToggleProps<A extends HTMLElement = HTMLElement> {
	id: string
	ref: DropdownContextValue<A>['setToggle']
	onClick: React.MouseEventHandler
	'aria-expanded': boolean
	'aria-haspopup'?: true
}

export interface UseDropdownToggleMetadata {
	show: DropdownContextValue['show']
	toggle: DropdownContextValue['toggle']
}

/**
 * Wires up Dropdown toggle functionality, returning a set a props to attach
 * to the element that functions as the dropdown toggle (generally a button).
 *
 * @memberOf Dropdown
 */

export const useDropdownToggle = <A extends HTMLElement = HTMLElement>(): [
	UseDropdownToggleProps<A>,
	UseDropdownToggleMetadata,
] => {
	const id = useSSRSafeId()
	const {
		show = false,
		toggle = noop,
		setToggle,
		menuElement,
	} = useContext(DropdownContext) || {}

	const handleClick = useCallback(
		(event: Event | React.SyntheticEvent<Element, Event>) => {
			toggle(!show, event)
		},
		[show, toggle],
	)

	const props: UseDropdownToggleProps = {
		id,
		ref: setToggle || noop,
		onClick: handleClick,
		'aria-expanded': !!show,
	}

	/**
	 * This is maybe better down in an effect,
	 * but the component is going to update anyway when the menu element is
	 * set so might return new props.
	 */
	if (menuElement && isRoleMenu(menuElement)) {
		props['aria-haspopup'] = true
	}

	return [props, { show, toggle }]
}
