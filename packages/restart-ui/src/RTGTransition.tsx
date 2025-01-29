import { useRTGTransitionProps } from './useRTGTransitionProps'
import type { TransitionProps } from './useRTGTransitionProps'
import type { TransitionComponent } from './types'

export type RTGTransitionProps = TransitionProps & {
	component: TransitionComponent
}

// Normalizes Transition callbacks when nodeRef is used.
export const RTGTransition = ({ component: Component, ...restProps }: RTGTransitionProps) => {
	const transitionProps = useRTGTransitionProps(restProps)

	return <Component {...transitionProps} />
}
