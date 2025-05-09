import { createContext, useContext } from 'react'
import type { Placement } from '../usePopper'

export type DropdownContextValue<A extends HTMLElement = HTMLElement> = {
	toggle: (
		nextShow: boolean,
		event?: React.SyntheticEvent | KeyboardEvent | MouseEvent | Event,
	) => void
	menuElement: HTMLElement | null
	toggleElement: HTMLElement | null
	setMenu: (ref: A | null) => void
	setToggle: (ref: A | null) => void
	show: boolean
	placement?: Placement
}

export const DropdownContext = createContext<DropdownContextValue<HTMLElement> | null>(null)

export const useDropdownContext = <A extends HTMLElement = HTMLElement>() =>
	useContext(DropdownContext) as DropdownContextValue<A> | null
