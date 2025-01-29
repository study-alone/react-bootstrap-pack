import { createPortal } from 'react-dom'
import { useWaitForDOMRef } from './useWaitForDOMRef'
import type { DOMContainer } from './useWaitForDOMRef'
import type { VirtualElement } from './usePopper'

export interface PortalProps {
	children: React.ReactElement

	/**
	 * A DOM element, Ref to an element, or function that returns either. The `container` will have the Portal children
	 * appended to it.
	 */
	container: DOMContainer

	/**
	 * Callback that is triggered when the portal content is rendered.
	 */
	onRendered?: (element: HTMLElement | VirtualElement | HTMLBodyElement) => void
}

export const Portal = ({ children, container, onRendered }: PortalProps) => {
	const resolvedContainer = useWaitForDOMRef(container, onRendered)

	return resolvedContainer ? <>{createPortal(children, resolvedContainer)}</> : null
}
