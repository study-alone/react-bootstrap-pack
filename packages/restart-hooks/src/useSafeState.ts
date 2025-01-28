import type { Dispatch, SetStateAction } from 'react'
import { useCallback } from 'react'
import { useMounted } from './useMounted'
import type { AsyncSetState } from './useStateAsync'

type StateSetter<TState> = Dispatch<SetStateAction<TState>>

/**
 * `useSafeState`는 `useState`의 반환 값을 취하고 Component가 unmount되면
 * 업데이트를 방지하기 위해 세터를 래핑합니다.
 * `useMergeState` 및 `useStateAsync`와 함께 사용할 수도 있습니다.
 *
 * @param state The return value of a useStateHook
 *
 * ```ts
 * const [show, setShow] = useSafeState(useState(true));
 * ```
 */
function useSafeState<TState>(
	state: [TState, AsyncSetState<TState>],
): [TState, (stateUpdate: React.SetStateAction<TState>) => Promise<void>]
function useSafeState<TState>(state: [TState, StateSetter<TState>]): [TState, StateSetter<TState>]
function useSafeState<TState>(
	state: [TState, StateSetter<TState> | AsyncSetState<TState>],
): [TState, StateSetter<TState> | AsyncSetState<TState>] {
	const [stateArg, action] = state
	const isMounted = useMounted()

	return [
		stateArg,
		useCallback(
			(nextState: SetStateAction<TState>) => {
				if (!isMounted()) return

				return action(nextState)
			},
			[action, isMounted],
		),
	]
}

export { useSafeState }
