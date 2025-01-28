import clsx from 'clsx'
import {
	ENTERED,
	ENTERING,
	EXITING,
	type TransitionCallbacks,
	type TransitionStatus,
} from '@repo/react-transition-group'
import { transitionEndListener } from '../transitionEndListener'
import { TransitionWrapper } from '../TransitionWrapper'
import { useBootstrapPrefix } from '../hooks/useBootstrapPrefix'
import type { BsPrefixOnlyProps } from '../types'

export interface OffcanvasTogglingProps extends TransitionCallbacks, BsPrefixOnlyProps {
	className?: string
	in?: boolean
	mountOnEnter?: boolean
	unmountOnExit?: boolean
	appear?: boolean
	timeout?: number
	children: (
		status: TransitionStatus,
		innerProps: {
			ref?: React.RefCallback<HTMLElement>
			className?: string
		},
	) => React.ReactNode
	nodeRef: React.RefObject<HTMLElement | null>
}

const transitionStyles = new Map<string, string>([
	[ENTERING, 'show'],
	[ENTERED, 'show'],
])

export const OffcanvasToggling = ({
	bsPrefix,
	className,
	children,
	in: inProp = false,
	mountOnEnter = false,
	unmountOnExit = false,
	appear = false,
	nodeRef,
	...restProps
}: OffcanvasTogglingProps) => {
	const prefix = useBootstrapPrefix(bsPrefix, 'offcanvas')

	return (
		<TransitionWrapper
			addEndListener={(done) => {
				if (nodeRef.current) {
					transitionEndListener(nodeRef.current, done)
				}
			}}
			in={inProp}
			mountOnEnter={mountOnEnter}
			unmountOnExit={unmountOnExit}
			appear={appear}
			{...restProps}
			nodeRef={nodeRef}
		>
			{(status, innerProps) =>
				children(status, {
					...innerProps,
					className: clsx(className, transitionStyles.get(status), innerProps.className, {
						[`${prefix}-toggling`]: [ENTERING, EXITING].some((item) => item === status),
					}),
				})
			}
		</TransitionWrapper>
	)
}
