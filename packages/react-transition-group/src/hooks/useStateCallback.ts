import { useCallback, useEffect, useRef, useState } from 'react'

export const useStateCallback = <S>(initialState: S | (() => S)) => {
	const [state, setState] = useState<S>(initialState)
	const cancelCallbackRef = useRef(false)
	const callbackRef = useRef<() => void>(null)

	const setStateCallback = useCallback((newState: S, callback?: () => void) => {
		cancelCallbackRef.current = false

		if (callback) {
			callbackRef.current = callback
		}

		setState(newState)
	}, [])

	const cancelCallback = useCallback(() => {
		cancelCallbackRef.current = true
		callbackRef.current = null
	}, [])

	useEffect(() => {
		if (callbackRef.current && !cancelCallbackRef.current) {
			callbackRef.current()
		}
		callbackRef.current = null
	}, [state])

	return [state, setStateCallback, cancelCallback] as const
}
