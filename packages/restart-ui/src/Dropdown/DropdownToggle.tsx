import { useDropdownToggle } from './useDropdownToggle'
import type { UseDropdownToggleProps, UseDropdownToggleMetadata } from './useDropdownToggle'

export interface DropdownToggleProps {
	/**
	 * A render prop that returns a Toggle element. The `props`
	 * argument should spread through to **a component that can accept a ref**. Use
	 * the `onToggle` argument to toggle the menu open or closed
	 *
	 * @type {Function ({
	 *   props: {
	 *     ref: (?HTMLElement) => void,
	 *     aria-haspopup: true
	 *     aria-expanded: boolean
	 *   },
	 *   meta: {
	 *     show: boolean,
	 *     toggle: (show: boolean) => void,
	 *   }
	 * }) => React.Element}
	 */
	children: (props: UseDropdownToggleProps, meta: UseDropdownToggleMetadata) => React.ReactNode
}

/**
 * Also exported as `<Dropdown.Toggle>` from `Dropdown`.
 *
 * @displayName DropdownToggle
 * @memberOf Dropdown
 */
export const DropdownToggle = ({ children }: DropdownToggleProps) => {
	const [props, meta] = useDropdownToggle()

	return <>{children(props, meta)}</>
}
