import { useCallback, useMemo } from 'react'
import clsx from 'clsx'
import {
	ENTERING,
	ENTERED,
	type TransitionStatus,
	type TransitionCallbacks,
} from '@repo/react-transition-group'
import { transitionEndListener } from './transitionEndListener'
import { triggerBorowserReflow } from './triggerBorowserReflow'
import { TransitionWrapper } from './TransitionWrapper'

export interface FadeProps extends TransitionCallbacks {
	className?: string
	in?: boolean
	mountOnEnter?: boolean
	unmountOnExit?: boolean
	appear?: boolean
	timeout?: number
	transitionClasses?: { [key in TransitionStatus]?: string }
	nodeRef?: React.RefObject<HTMLElement | null>
	children: (
		status: TransitionStatus,
		innerProps: {
			ref?: React.RefCallback<HTMLElement>
			[key: string]: unknown
		},
	) => React.ReactNode
}

const fadeStyles = new Map([
	[ENTERING, 'show'],
	[ENTERED, 'show'],
])

export const Fade = ({
	className,
	transitionClasses = {},
	onEnter,
	nodeRef,
	children,
	...restProps
}: FadeProps) => {
	const props = {
		in: false,
		timeout: 300,
		mountOnEnter: false,
		unmountOnExit: false,
		appear: false,
		nodeRef,
		...restProps,
	}

	const transitionClassesMap = useMemo(() => {
		return new Map<TransitionStatus, string>(
			Object.entries(transitionClasses).map(([key, value]) => {
				return [key as TransitionStatus, value]
			}),
		)
	}, [transitionClasses])

	const handleEnter = useCallback(
		(isAppearing: boolean) => {
			if (nodeRef?.current) {
				triggerBorowserReflow(nodeRef.current)
			}
			onEnter?.(isAppearing)
		},
		[nodeRef, onEnter],
	)

	const handleAddEndListener = useCallback(
		(done: () => void) => {
			if (nodeRef?.current) {
				transitionEndListener(nodeRef.current, done)
			}
		},
		[nodeRef],
	)

	return (
		<TransitionWrapper
			addEndListener={handleAddEndListener}
			{...props}
			onEnter={handleEnter}
			nodeRef={nodeRef}
		>
			{(status, innerProps) => {
				return children(status, {
					...innerProps,
					className: clsx(
						'fade',
						className,
						fadeStyles.get(status),
						transitionClassesMap.get(status),
					),
				})
			}}
		</TransitionWrapper>
	)
}
