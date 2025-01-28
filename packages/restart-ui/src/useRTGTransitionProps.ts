import { useMemo, useRef } from 'react'
import type {
	TransitionProps as OriginalTransitionProps,
	RenderChildren,
} from '@repo/react-transition-group'

export type TransitionProps = Omit<OriginalTransitionProps, 'children'> & {
	children: RenderChildren
}

function normalizeExit(callback?: () => void) {
	return () => {
		if (callback) {
			callback()
		}
	}
}
function normalizeEndListener(callback?: (done: () => void) => void) {
	return (listener: () => void) => {
		if (callback) {
			callback(listener)
		}
	}
}

function normalizeEnter(callback?: (isAppearing: boolean) => void) {
	return (isAppearing: boolean) => {
		if (callback) {
			callback(isAppearing)
		}
	}
}

/**
 * Normalizes RTG transition callbacks with nodeRef to better support
 * strict mode.
 *
 * @param props Transition props.
 * @returns Normalized transition props.
 */
export const useRTGTransitionProps = ({
	onEnter,
	onEntering,
	onEntered,
	onExit,
	onExiting,
	onExited,
	addEndListener,
	children,
	...restProps
}: TransitionProps) => {
	const nodeRef = useRef<HTMLElement>(null)

	const handleEnter = useMemo(() => normalizeEnter(onEnter), [onEnter])
	const handleEntering = useMemo(() => normalizeEnter(onEntering), [onEntering])
	const handleEntered = useMemo(() => normalizeEnter(onEntered), [onEntered])
	const handleExit = useMemo(() => normalizeExit(onExit), [onExit])
	const handleExiting = useMemo(() => normalizeExit(onExiting), [onExiting])
	const handleExited = useMemo(() => normalizeExit(onExited), [onExited])
	const handleAddEndListener = useMemo(
		() => normalizeEndListener(addEndListener),
		[addEndListener],
	)

	return {
		...restProps,
		nodeRef,
		...(onEnter && { onEnter: handleEnter }),
		...(onEntering && { onEntering: handleEntering }),
		...(onEntered && { onEntered: handleEntered }),
		...(onExit && { onExit: handleExit }),
		...(onExiting && { onExiting: handleExiting }),
		...(onExited && { onExited: handleExited }),
		...(addEndListener && { addEndListener: handleAddEndListener }),
		children,
	}
}
