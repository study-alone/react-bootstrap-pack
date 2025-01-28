import type { TransitionCallbacks, RenderChildren } from '@repo/react-transition-group'

export type EventKey = string | number

export type SelectCallback = (eventKey: string | null, e: React.SyntheticEvent) => void

export interface TransitionProps extends TransitionCallbacks {
	in?: boolean
	appear?: boolean
	children: RenderChildren
	mountOnEnter?: boolean
	unmountOnExit?: boolean
	nodeRef: React.RefObject<HTMLElement | null>
}

export type TransitionComponent = React.FC<TransitionProps>

export type { TransitionCallbacks }
