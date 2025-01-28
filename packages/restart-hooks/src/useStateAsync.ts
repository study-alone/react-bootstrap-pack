import { useCallback, useEffect, useRef, useState } from 'react'

type Updater<TState> = (state: TState) => TState

export type AsyncSetState<TState> = (stateUpdate: React.SetStateAction<TState>) => Promise<TState>

/**
 * A hook that mirrors `useState` in function and API, expect that setState calls return a promise that resolves after the state has been set (in an effect).
 *
 * 함수와 API에서 `useState`를 반영하는 hook은 setState 호출이 상태가 설정된 후(effect 내에서)
 * 확인되는 Promise을 반환한다는 것을 예상합니다.
 *
 * T이는 클래스형 setState 호출의 두 번째 콜백과 _유사_하지만 나중에 실행됩니다.
 *
 * ```ts
 * const [counter, setState] = useStateAsync(1);
 *
 * const handleIncrement = async () => {
 *   await setState(2);
 *   doWorkRequiringCurrentState()
 * }
 * ```
 *
 * @param initialState `useState`와 동일한 상태 값으로 초기화합니다.
 */
export function useStateAsync<TState>(
	initialState: TState | (() => TState),
): [TState, AsyncSetState<TState>] {
	const [state, setState] = useState(initialState)
	const resolvers = useRef<((state: TState) => void)[]>([])

	useEffect(() => {
		resolvers.current.forEach((resolve) => resolve(state))
		resolvers.current.length = 0
	}, [state])

	const setStateAsync = useCallback(
		(update: Updater<TState>) => {
			return new Promise<TState>((resolve, reject) => {
				setState((prevState) => {
					try {
						let nextState: TState

						if (update instanceof Function) {
							nextState = update(prevState)
						} else {
							nextState = update
						}

						/**
						 * 상태가 변경되지 않으면 React가 다시 렌더링하지 않고 effect가 resolve되지 않으므로 Promise를 resolve해야 합니다.
						 * 이미 대기 중인 Resolver가 있는 경우 업데이트가 발생할 것이라고 가정하는 것이 안전해야 합니다.
						 */
						if (!resolvers.current.length || Object.is(nextState, prevState)) {
							resolve(nextState)
						} else {
							resolvers.current.push(resolve)
						}

						return nextState
					} catch (error) {
						// eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
						reject(error)
						throw error
					}
				})
			})
		},
		[setState],
	)

	return [state, setStateAsync as AsyncSetState<TState>]
}
