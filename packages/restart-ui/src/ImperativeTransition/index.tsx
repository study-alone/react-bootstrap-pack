import { useEffect, useState } from 'react'
import { useMergedRefs } from '@repo/restart-hooks'
import { useTransition, type TransitionHandler } from './useTransition'
import type { TransitionProps } from '../types'

export interface ImperativeTransitionProps extends Omit<TransitionProps, 'nodeRef'> {
	transition: TransitionHandler
	appear: true
	mountOnEnter: true
	unmountOnExit: true
}

export const ImperativeTransition = ({
	children,
	in: inProp,
	onExited,
	onEntered,
	transition,
}: ImperativeTransitionProps) => {
	const [exited, setExited] = useState(!inProp)

	const ref = useTransition({
		in: !!inProp,
		onTransition: (options) => {
			const onFinish = () => {
				if (options.isStale()) return

				if (options.in) {
					onEntered?.(options.initial)
				} else {
					setExited(true)
					onExited?.()
				}
			}

			Promise.resolve(transition(options)).then(onFinish, (error) => {
				if (!options.in) setExited(true)
				throw error
			})
		},
	})

	const combineRef = useMergedRefs(ref)

	useEffect(() => {
		if (inProp && exited) {
			setExited(false)
		}
	}, [exited, inProp])

	return exited && !inProp ? null : children('exited', { ref: combineRef })
}
