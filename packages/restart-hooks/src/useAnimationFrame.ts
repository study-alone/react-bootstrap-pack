import { useEffect, useState } from 'react'
import { useMounted } from './useMounted'

export interface UseAnimationFrameReturn {
	cancel(): void

	/**
	 * 제공된 콜백이 다음 애니메이션 프레임에서 호출되도록 요청
	 * 이전에 등록된 콜백은 취소됩니다.
	 */
	request(callback: FrameRequestCallback): void
}

type AnimationFrameState = {
	fn: FrameRequestCallback
}

/**
 * @description
 * 구성 요소가 언마운트되면 적절하게 정리되는 애니메이션 프레임을 요청하고
 * 취소하기 위한 컨트롤러 객체를 반환합니다. 새 요청은 기존 요청을 취소하고 대체합니다.
 *
 * @example
 * ```tsx
 * const [style, setStyle] = useState({});
 * const animationFrame = useAnimationFrame();
 *
 * const handleMouseMove = (e) => {
 *      animationFrame.request(() => {
 *      setStyle({ top: e.clientY, left: e.clientY })
 *      })
 * }
 *
 * const handleMouseUp = () => {
 *      animationFrame.cancel()
 * }
 *
 * return (
 *      <div onMouseUp={handleMouseUp} onMouseMove={handleMouseMove}>
 *          <Ball style={style} />
 *      </div>
 * )
 * ```
 */
export function useAnimationFrame(): UseAnimationFrameReturn {
	const isMounted = useMounted()

	const [animationFrame, setAnimationFrameState] = useState<AnimationFrameState | null>(null)

	useEffect(() => {
		if (!animationFrame) {
			return
		}

		const { fn } = animationFrame
		const handle = requestAnimationFrame(fn)

		return () => {
			cancelAnimationFrame(handle)
		}
	}, [animationFrame])

	const [returnValue] = useState(() => ({
		request(callback: FrameRequestCallback) {
			if (!isMounted()) return
			setAnimationFrameState({ fn: callback })
		},
		cancel() {
			if (!isMounted()) return
			setAnimationFrameState(null)
		},
	}))

	return returnValue
}
