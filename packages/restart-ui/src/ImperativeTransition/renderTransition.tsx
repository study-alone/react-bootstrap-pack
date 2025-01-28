import { NoopTransition } from '../NoopTransition'
import { RTGTransition } from '../RTGTransition'
import { ImperativeTransition } from './index'
import type { TransitionComponent, TransitionProps } from '../types'
import type { ImperativeTransitionProps } from './index'

export interface TransitionFunctionOptions {
	in: boolean
	element: HTMLElement
	initial: boolean
	isStale: () => boolean
}

export type TransitionHandler = (options: TransitionFunctionOptions) => void | Promise<void>

type PropsParameter = TransitionProps &
	Omit<ImperativeTransitionProps, 'transition'> & {
		nodeRef: React.RefObject<HTMLElement | null>
	}

export const renderTransition = <C extends TransitionComponent | undefined>(
	component: C,
	runTransition: TransitionHandler | undefined,
	props: C extends undefined ? Omit<PropsParameter, 'nodeRef'> : PropsParameter,
) => {
	if (component) {
		return <RTGTransition {...props} component={component} />
	}

	if (runTransition) {
		return <ImperativeTransition {...props} transition={runTransition} />
	}

	return <NoopTransition {...props} />
}
