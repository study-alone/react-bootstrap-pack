import { useReducer } from 'react'

// type UseForceUpdateProps = {
// 	once?: boolean
// }

/**
 * Returns a function that triggers a component update. the hook equivalent to
 * `this.forceUpdate()` in a class component. In most cases using a state value directly
 * is preferable but may be required in some advanced usages of refs for interop or
 * when direct DOM manipulation is required.
 *
 * ```ts
 * const forceUpdate = useForceUpdate();
 *
 * const updateOnClick = useCallback(() => {
 *  forceUpdate()
 * }, [forceUpdate])
 *
 * return <button type="button" onClick={updateOnClick}>Hi there</button>
 * ```
 */
export function useForceUpdate(/* { once = false }: UseForceUpdateProps = {} */) {
	// const disabledHandler = useRef(once)

	/**
	 * 토글 상태 값은 마지막 상태 값과 엄격하게 동일할 때
	 * 업데이트를 건너뛰는 React 최적화를 무력화하도록 설계되었습니다.
	 */
	const [, dispatch] = useReducer<number, [(state: number) => number]>(
		(revision) => revision + 1,
		0,
	)

	return () => {
		// if (once && !disabledHandler.current) disabledHandler.current = true

		// if (!disabledHandler)
		dispatch((revision) => revision + 1)
	}
}
