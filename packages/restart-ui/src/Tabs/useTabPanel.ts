import { useContext } from 'react'
import { makeEventKey } from '../SelectableContext'
import { TabContext } from './TabContext'
import type { TabPanelProps } from './TabPanel'

export const useTabPanel = ({
	active,
	eventKey,
	mountOnEnter,
	transition,
	unmountOnExit,
	role = 'tabpanel',
	onEnter,
	onEntering,
	onEntered,
	onExit,
	onExiting,
	onExited,
	...restProps
}: TabPanelProps) => {
	const context = useContext(TabContext)

	if (!context) {
		return [
			{ ...restProps, role },
			{
				eventKey,
				isActive: !!active,
				mountOnEnter,
				transition,
				unmountOnExit,
				onEnter,
				onEntering,
				onEntered,
				onExit,
				onExiting,
				onExited,
			},
		]
	}

	const { activeKey, getControlledId, getControllerId, ...rest } = context
	const key = makeEventKey(eventKey)

	return [
		{
			...restProps,
			role,
			id: getControlledId(eventKey!),
			'aria-labelledby': getControllerId(eventKey!),
		},
		{
			eventKey,
			isActive: active == null && key != null ? makeEventKey(activeKey) === key : active,
			transition: transition || rest.transition,
			mountOnEnter: mountOnEnter != null ? mountOnEnter : rest.mountOnEnter,
			unmountOnExit: unmountOnExit != null ? unmountOnExit : rest.unmountOnExit,
			onEnter,
			onEntering,
			onEntered,
			onExit,
			onExiting,
			onExited,
		},
	] as const
}
