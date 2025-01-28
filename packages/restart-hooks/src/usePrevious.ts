import { useEffect, useRef } from 'react'

/**
 * 어떤 값의 마지막을 저장합니다.
 * `Ref`를 통해 추적되며 구성 요소가 렌더링된 후에만 업데이트합니다.
 *
 * 렌더링 중에 prop 값을 이전 값과 비교해야 하는 경우 유용합니다.
 *
 * ```ts
 * function Component(props) {
 *   const lastProps = usePrevious(props)
 *
 *   if (lastProps.foo !== props.foo)
 *     resetValueFromProps(props.foo)
 * }
 * ```
 *
 * @param value the value to track
 */
export function usePrevious<T>(value: T): T | null {
	const ref = useRef<T | null>(null)

	useEffect(() => {
		ref.current = value
	})

	return ref.current
}
