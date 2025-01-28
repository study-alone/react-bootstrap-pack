import { useCallback, useEffect, useRef } from 'react'
import { style } from '@repo/dom-helper'
import { TransitionGroupContext, useTransitionGroupContext } from './TransitionGroupContext'
import { forceReflow } from './utils/forceReflow'
import config from './config'
import { getMsNumber } from './utils/getMsNumber'
import { useStateCallback } from './hooks/useStateCallback'

export const UNMOUNTED = 'unmounted'
export const EXITED = 'exited'
export const ENTERING = 'entering'
export const ENTERED = 'entered'
export const EXITING = 'exiting'

type Timeout =
	| number
	| {
			enter?: number
			exit?: number
			appear?: number
	  }

export type TransitionStatus =
	| typeof UNMOUNTED
	| typeof EXITED
	| typeof ENTERING
	| typeof ENTERED
	| typeof EXITING

interface NextCallback {
	(event?: Event): void
	cancel?: () => void
}

export interface TransitionCallbacks {
	/**
	 * @description
	 * Callback fired before the "entering" status is applied.
	 * An extra parameter isAppearing is supplied to indicate
	 * if the enter stage is occurring on the initial mount
	 */
	onEnter?: (isAppearing: boolean) => void
	/**
	 * @description
	 * Callback fired after the "entering" status is applied.
	 * An extra parameter isAppearing is supplied to indicate
	 * if the enter stage is occurring on the initial mount
	 */
	onEntering?: (isAppearing: boolean) => void
	/**
	 * @description
	 * Callback fired after the "entering" status is applied.
	 * An extra parameter isAppearing is supplied to indicate
	 * if the enter stage is occurring on the initial mount
	 */
	onEntered?: (isAppearing: boolean) => void
	/**
	 * @description Callback fired before the "exiting" status is applied.
	 */
	onExit?: () => void
	/**
	 * @description Callback fired after the "exiting" status is applied.
	 */
	onExiting?: () => void
	/**
	 * @description Callback fired after the "exited" status is applied.
	 */
	onExited?: () => void
}

export type RenderChildren = (
	status: TransitionStatus,
	childProps: {
		ref?: React.RefCallback<HTMLElement>
		[key: string]: unknown
	},
) => React.ReactNode

export interface TransitionProps extends TransitionCallbacks {
	/**
	 * @default false
	 * @description Show the component; triggers the enter or exit states
	 */
	in?: boolean
	/**
	 * @default true
	 * @description Enable or disable enter transitions.
	 */
	enter?: boolean
	/**
	 * @default false
	 * @description
	 * By default the child component does not perform the enter transition when it first mounts,
	 * regardless of the value of in. If you want this behavior, set both appear and in to true.
	 * @note
	 * there are no special appear states like appearing/appeared, this prop only adds
	 * an additional enter transition. However, in the <CSSTransition> component that
	 * first enter transition does result in additional .appear-* classes,
	 * that way you can choose to style it differently.
	 */
	appear?: boolean
	/**
	 * @default false
	 * @description
	 * By default the child component stays mounted after it reaches the 'exited' state.
	 * Set unmountOnExit if you'd prefer to unmount the component after it finishes exiting.
	 */
	unmountOnExit?: boolean
	/**
	 * @default false
	 * @description
	 * By default the child component is mounted immediately along with the parent Transition component.
	 * If you want to "lazy mount" the component on the first in={true} you can set mountOnEnter.
	 * After the first enter transition the component will stay mounted, even on "exited",
	 * unless you also specify unmountOnExit.
	 */
	mountOnEnter?: boolean
	/**
	 * @default true
	 * @description Enable or disable exit transitions.
	 */
	exit?: boolean
	nodeRef?: React.RefObject<HTMLElement | null>
	/**
	 * @default {appear:0,enter:0,exit:0}
	 * @description
	 * The duration of the transition, in milliseconds. Required unless addEndListener is provided.
	 * `transition-duration` 시간을 읽을 수 있다면 timeout은 무시됩니다.
	 */
	timeout?: Timeout
	/**
	 * @description
	 * Add a custom transition end trigger. Called with the transitioning DOM node and a done callback.
	 * Allows for more fine grained transition end logic.
	 * Timeouts are still used as a fallback if provided.
	 */
	addEndListener?: (done: () => void) => void
	children: RenderChildren
}

export const Transition = ({
	in: inProp = false,
	mountOnEnter = false,
	unmountOnExit = false,
	appear = false,
	enter = true,
	exit = true,
	timeout = {
		appear: 0,
		enter: 0,
		exit: 0,
	},
	addEndListener,
	onEnter = () => {},
	onEntering = () => {},
	onEntered = () => {},
	onExit = () => {},
	onExiting = () => {},
	onExited = () => {},
	nodeRef, // 필수 prop
	children,
}: TransitionProps) => {
	const transitionTimeoutRef = useRef<number>(null)
	const context = useTransitionGroupContext()
	const [status, setStatus, cancelCallback] = useStateCallback<TransitionStatus>(() => {
		const _appear = context && !context.isMounting ? enter : appear

		if (inProp) {
			return _appear ? EXITED : ENTERED
		} else {
			return unmountOnExit || mountOnEnter ? UNMOUNTED : EXITED
		}
	})

	const getTimeouts = useCallback(() => {
		const isNumber = typeof timeout === 'number'

		return {
			exit: isNumber ? timeout : timeout.exit,
			enter: isNumber ? timeout : timeout.enter,
			appear: isNumber
				? timeout
				: timeout.appear !== undefined
					? timeout.appear
					: timeout.enter,
		}
	}, [timeout])

	const onTransitionEnd = useCallback(
		(timeout: number | undefined, handler: NextCallback) => {
			// setNextCallback(handler)
			window.clearTimeout(transitionTimeoutRef.current || undefined)

			const doesNotHaveTimeoutOrListener = !timeout && !addEndListener
			// const nextCallback = nextCallbackRef.current || (() => {})
			const nextCallback = handler

			if (!nodeRef?.current || doesNotHaveTimeoutOrListener) {
				window.setTimeout(nextCallback, 0)
				return
			}

			if (addEndListener) addEndListener(nextCallback)

			const transitionDuration = getMsNumber(style(nodeRef?.current, 'transition-duration'))
			console.log('transition-duration', transitionDuration)

			let transitionTime = timeout || transitionDuration
			if (transitionDuration !== 0 && timeout !== 0 && timeout !== transitionDuration) {
				transitionTime = transitionDuration
			}
			transitionTimeoutRef.current = window.setTimeout(nextCallback, transitionTime)
		},
		[addEndListener, nodeRef],
	)

	const performEnter = useCallback(
		(mounting: boolean) => {
			const appearing = context ? context.isMounting : mounting
			const timeouts = getTimeouts()
			const enterTimeout = appearing ? timeouts.appear : timeouts.enter

			if ((!mounting && !enter) || config.disabled) {
				setStatus(ENTERED, () => {
					onEntered(appearing)
				})
				return
			}
			console.log(enterTimeout)
			console.log('<Transition> excute onEnter')
			onEnter(appearing)
			setStatus(ENTERING, () => {
				console.log('<Transition> excute onEnterig')
				onEntering(appearing)

				onTransitionEnd(enterTimeout, () => {
					setStatus(ENTERED, () => {
						console.log('<Transition> excute onEntered')
						onEntered(appearing)
					})
				})
			})
		},
		[
			context,
			enter,
			getTimeouts,
			onEnter,
			onEntered,
			onEntering,
			onTransitionEnd,
			// safeSetStatus,
			setStatus,
		],
	)

	const performExit = useCallback(() => {
		const timeouts = getTimeouts()

		if (!exit || config.disabled) {
			setStatus(EXITED, onExited)
			return
		}

		onExit()
		setStatus(EXITING, () => {
			onExiting()
			onTransitionEnd(timeouts.exit, () => setStatus(EXITED, onExited))
		})
	}, [
		exit,
		getTimeouts,
		onExit,
		onExited,
		onExiting,
		onTransitionEnd,
		// safeSetStatus,
		setStatus,
	])

	const updateStatus = useCallback(
		(mounting = false, nextStatus: TransitionStatus | null) => {
			if (nextStatus !== null) {
				// cancelNextCallback()
				cancelCallback()

				if (nextStatus === ENTERING) {
					if (unmountOnExit || mountOnEnter) {
						if (nodeRef?.current) forceReflow(nodeRef.current)
					}

					performEnter(mounting)
				} else {
					performExit()
				}
			} else if (unmountOnExit && status === EXITED) {
				setStatus(UNMOUNTED)
			}
		},
		[
			mountOnEnter,
			nodeRef,
			performEnter,
			performExit,
			status,
			unmountOnExit,
			setStatus,
			cancelCallback,
		],
	)

	useEffect(() => {
		let nextStatus: TransitionStatus | null = null

		if (inProp) {
			if (status !== ENTERING && status !== ENTERED) {
				nextStatus = ENTERING
			}
		} else {
			if (status === ENTERING || status === ENTERED) {
				nextStatus = EXITING
			}
		}
		updateStatus(false, nextStatus)
	}, [inProp, status, updateStatus])

	useEffect(() => {
		if (inProp && status === UNMOUNTED) {
			setStatus(EXITED)
		}
	}, [inProp, setStatus, status])

	if (status === UNMOUNTED) {
		return null
	}

	return (
		<TransitionGroupContext value={{ isMounting: false }}>
			{children(status, {})}
		</TransitionGroupContext>
	)
}
