import { useEffect, useRef } from 'react'

/**
 * @description
 * Component가 현재 mount되었는지 추적합니다.
 * 일반적으로 Component가 unmount된 후에 실행되지 않도록 effects를 적절히 취소하는 것보다
 * 덜 선호되지만 `Promise` resolve 같이 실행 불가능한 경우에는 유용합니다.
 *
 * @returns isMounted 상태를 추적하는 함수를 반환
 *
 * ```ts
 * const [data, setData] = useState(null)
 * const iseMounted = useMounted()
 *
 * useEffect(() => {
 *      fetchdata().then(newData => {
 *          if (isMounted()) {
 *             setData(newData)
 *          }
 *      })
 * })
 */
export function useMounted(): () => boolean {
	const mounted = useRef(true)
	const isMounted = useRef(() => mounted.current)

	useEffect(() => {
		mounted.current = true

		return () => {
			mounted.current = false
		}
	}, [])

	return isMounted.current
}
