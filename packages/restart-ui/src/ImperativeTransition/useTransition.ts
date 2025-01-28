import { useRef } from 'react'
import { useEventCallback, useIsomorphicEffect } from '@repo/restart-hooks'

export interface TransitionFunctionOptions {
	in: boolean
	element: HTMLElement
	initial: boolean
	isStale: () => boolean
}

export type TransitionHandler = (options: TransitionFunctionOptions) => void | Promise<void>

interface UseTransitionOptions {
	in: boolean
	onTransition: TransitionHandler
	initial?: boolean
}

export const useTransition = ({ in: inProp, onTransition }: UseTransitionOptions) => {
	const ref = useRef<HTMLElement>(null)
	const isInitialRef = useRef(true)
	const handleTransition = useEventCallback(onTransition)

	useIsomorphicEffect(() => {
		if (!ref.current) {
			return
		}

		let stale = false

		void handleTransition({
			in: inProp,
			element: ref.current,
			initial: isInitialRef.current,
			isStale: () => stale,
		})

		return () => {
			stale = true
		}
	}, [inProp, handleTransition])

	useIsomorphicEffect(() => {
		isInitialRef.current = false

		// for strict mode
		return () => {
			isInitialRef.current = true
		}
	}, [])

	return ref
}
