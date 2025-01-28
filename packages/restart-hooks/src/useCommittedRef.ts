import { useEffect, useRef } from 'react'

/**
 * effects에서 값이 업데이트되는 `Ref`를 생성하여 가장 최근의 값이 렌더링되도록 합니다.
 * 일반적으로 `render()`에서 이전 작업을 사용하기 전에
 * 삭제할 수 있는 Concurrent 모드 사용에만 필요합니다.
 *
 * 이벤트 핸들러에서 접근하는 것이 안전합니다.
 *
 * @param value `Ref`를 의미합니다.
 */
export function useCommittedRef<TValue>(value: TValue) {
	const ref = useRef<TValue>(value)

	useEffect(() => {
		ref.current = value
	}, [value])

	return ref
}
