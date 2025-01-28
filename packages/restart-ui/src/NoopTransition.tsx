import { useEffect, useRef } from 'react'
import { useEventCallback, useMergedRefs } from '@repo/restart-hooks'
import type { TransitionProps } from './types'

export const NoopTransition = ({
	children,
	in: inProp,
	onExited = () => {},
	mountOnEnter,
	unmountOnExit,
}: Omit<TransitionProps, 'nodeRef'>) => {
	const ref = useRef<HTMLElement | null>(null)
	const hasEnteredRef = useRef(inProp)
	const handleExited = useEventCallback(onExited)

	useEffect(() => {
		if (inProp) {
			hasEnteredRef.current = true
		} else {
			handleExited()
		}
	}, [handleExited, inProp])

	const combinedRef = useMergedRefs(ref)

	if (inProp) return children('exited', { ref: combinedRef })

	if (unmountOnExit) {
		return null
	}

	if (!hasEnteredRef.current && mountOnEnter) {
		return null
	}

	return children('exited', { ref: combinedRef })
}
