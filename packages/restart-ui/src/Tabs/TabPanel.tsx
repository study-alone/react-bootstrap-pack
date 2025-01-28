import { useEffect, useRef } from 'react'
import { SelectableContext } from '../SelectableContext'
import { NoopTransition } from '../NoopTransition'
import { TabContext } from './TabContext'
import { useTabPanel } from './useTabPanel'
import type { EventKey, TransitionCallbacks, TransitionComponent } from '../types'

export interface TabPanelProps extends TransitionCallbacks, React.HTMLAttributes<HTMLElement> {
	/**
	 * Element used to render the component.
	 */
	as?: React.ElementType

	/**
	 * A key that associates the `TabPanel` with it's controlling `NavLink`.
	 */
	eventKey?: EventKey

	/**
	 * Toggles the active state of the TabPanel, this is generally controlled by `Tabs`.
	 */
	active?: boolean

	/**
	 * Use animation when showing or hiding `<TabPanel>`s. Use a react-transition-group
	 * `<Transition/>` component.
	 */
	transition?: TransitionComponent

	/**
	 * Wait until the first "enter" transition to mount the tab (add it to the DOM)
	 */
	mountOnEnter?: boolean

	/**
	 * Unmount the tab (remove it from the DOM) when it is no longer visible
	 */
	unmountOnExit?: boolean

	ref?: React.RefObject<HTMLElement | null>
}

export interface TabPanelMetadata extends TransitionCallbacks {
	eventKey?: EventKey
	isActive?: boolean
	transition?: TransitionComponent
	mountOnEnter?: boolean
	unmountOnExit?: boolean
}

export const TabPanel = ({ as: Component = 'div', ref, ...restProps }: TabPanelProps) => {
	const alternativeNodeRef = useRef<HTMLElement>(null)
	const [
		tabPanelProps,
		{
			isActive,
			onEnter,
			onEntering,
			onEntered,
			onExit,
			onExiting,
			onExited,
			mountOnEnter,
			unmountOnExit,
			transition: Transition = NoopTransition,
		},
	] = useTabPanel(restProps)

	useEffect(() => {
		if (ref && !alternativeNodeRef.current) {
			alternativeNodeRef.current = ref.current
		}
	})

	// `<TabPanel>`의 `<Nav>`가 최상위 수준과 충돌하지 않도록 빈 TabContext를 제공합니다.
	return (
		<TabContext.Provider value={null}>
			<SelectableContext.Provider value={null}>
				<Transition
					in={isActive}
					onEnter={onEnter}
					onEntering={onEntering}
					onEntered={onEntered}
					onExit={onExit}
					onExiting={onExiting}
					onExited={onExited}
					mountOnEnter={mountOnEnter}
					unmountOnExit={unmountOnExit}
					nodeRef={ref || alternativeNodeRef}
				>
					{(status, childProps) => (
						<Component
							{...tabPanelProps}
							{...childProps}
							hidden={!isActive}
							aria-hidden={!isActive}
						/>
					)}
				</Transition>
			</SelectableContext.Provider>
		</TabContext.Provider>
	)
}
