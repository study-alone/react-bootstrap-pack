import { useMemo, useRef } from 'react'
import { Transition } from '@repo/react-transition-group'
import { useMergedRefs } from '@repo/restart-hooks'
import type { TransitionProps, TransitionStatus } from '@repo/react-transition-group'

export type TransitionWrapperProps = Omit<TransitionProps, 'children'> & {
	children: (
		status: TransitionStatus,
		props: {
			ref: React.RefCallback<HTMLElement>
			className?: string
		},
	) => React.ReactNode
}

// nodeRef를 사용할 때 TransitioCallback을 정규화합니다.
export const TransitionWrapper = ({
	onEnter = () => {},
	onEntering = () => {},
	onEntered = () => {},
	onExit = () => {},
	onExited = () => {},
	onExiting = () => {},
	addEndListener = () => {},
	children,
	nodeRef: originalNodeRef,
	...restProps
}: TransitionWrapperProps) => {
	const nodeRef = useRef<HTMLElement>(null)
	const mergedRef = useMergedRefs(nodeRef, originalNodeRef)

	const attachRef = (refNode: HTMLElement | null | undefined) => {
		if (refNode) {
			mergedRef(refNode)
		}
	}

	const normalizeEnter = (callback: (isAppearing: boolean) => void) => (isAppearing: boolean) => {
		if (callback) {
			callback(isAppearing)
		}
	}
	const normalizeExit = (callback: () => void) => () => {
		if (callback) {
			callback()
		}
	}
	const normalizeEndListener = (callback?: (done: () => void) => void) => {
		return (listener: () => void) => {
			if (callback) {
				callback(listener)
			}
		}
	}

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

	return (
		<Transition
			{...restProps}
			onEnter={handleEnter}
			onEntering={handleEntering}
			onEntered={handleEntered}
			onExit={handleExit}
			onExiting={handleExiting}
			onExited={handleExited}
			addEndListener={handleAddEndListener}
			nodeRef={nodeRef}
		>
			{(status, childProps) => {
				return children(status, { ...childProps, ref: attachRef })
			}}
		</Transition>
	)
}
