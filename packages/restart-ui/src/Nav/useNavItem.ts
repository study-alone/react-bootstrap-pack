import { useContext } from 'react'
import { useEventCallback } from '@repo/restart-hooks'
import { SelectableContext } from '../SelectableContext'
import { TabContext } from '../Tabs/TabContext'
import { dataAttr } from '../dataKey'
import { NavContext } from './NavContext'

export interface UseNavItemOptions {
	key: string | null
	onClick?: React.MouseEventHandler
	active?: boolean
	disabled?: boolean
	id?: string
	role?: string
}

interface ReturnProps {
	role?: string
	id?: string
	tabIndex?: number
	onClick?: React.MouseEventHandler
	'data-rr-ui-event-key'?: string | null
	'aria-controls'?: string
	'aria-selected'?: boolean
	'aria-disabled'?: boolean
	'data-rr-ui-active'?: boolean
}

export const useNavItem = ({ key, onClick, active, id, role, disabled }: UseNavItemOptions) => {
	const parentOnSelect = useContext(SelectableContext)
	const navContext = useContext(NavContext)
	const tabContext = useContext(TabContext)

	let isActive = active
	const props: ReturnProps = {
		role,
	}

	if (navContext) {
		if (!role && navContext.role === 'tablist') {
			props.role = 'tab'
		}

		const contextControllerId = navContext.getControllerId(key)
		const contextControlledId = navContext.getControlledId(key)

		props[dataAttr('event-key')] = key

		props.id = contextControllerId || id

		isActive = active == null && key != null ? navContext.activeKey === key : active

		/**
		 * `mountOnEnter`에 대한 단순화된 시나리오.
		 *
		 * 적어도 한 번 이상 마운트된 탭에 대해 'aria-controls'를 유지하는 것이 합리적이기는 하지만
		 * 코드가 상당히 복잡해지고 이득이 거의 없습니다. 다음 구현은 아마도 충분할 것입니다.
		 *
		 * @see https://github.com/react-restart/ui/pull/40#issuecomment-1009971561
		 */
		if (isActive || (!tabContext?.unmountOnExit && !tabContext?.mountOnEnter)) {
			props['aria-controls'] = contextControlledId || undefined
		}
	}

	if (props.role == 'tab') {
		props['aria-selected'] = isActive

		if (!isActive) {
			props.tabIndex = -1
			props['aria-disabled'] = true
		}
	}

	props.onClick = useEventCallback((event: React.MouseEvent) => {
		if (disabled) return

		onClick?.(event)

		if (key == null) {
			return
		}

		if (parentOnSelect && !event.isPropagationStopped()) {
			parentOnSelect(key, event)
		}
	})

	return [props, { isActive }] as const
}
