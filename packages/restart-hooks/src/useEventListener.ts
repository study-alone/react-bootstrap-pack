import { useEffect } from 'react'
import { useEventCallback } from './useEventCallback'

type EventHandler<T, K extends keyof DocumentEventMap> = (
	this: T,
	event: DocumentEventMap[K],
) => void

/**
 * React 합성 이벤트 시스템을 우회하여 지정된 DOM 요소에 직접 이벤트 핸들러를 연결합니다.
 *
 * @param element 이벤트를 수신할 대상
 * @param event DOM event name
 * @param handler event handler
 * @param capture 캡처 이벤트 단계 동안 수신할지 여부
 */
export function useEventListener<
	T extends Element | Document | Window,
	K extends keyof DocumentEventMap,
>(
	eventTarget: T | (() => T),
	event: K,
	listener: EventHandler<T, K>,
	capture: boolean | AddEventListenerOptions = false,
) {
	const handler = useEventCallback(listener)

	const eventHandler = (event: Event) => {
		const typedEvent = event as DocumentEventMap[K]
		handler?.(typedEvent)
	}

	useEffect(() => {
		const target = typeof eventTarget === 'function' ? eventTarget() : eventTarget

		target.addEventListener(event, eventHandler, capture)

		return () => target.removeEventListener(event, eventHandler, capture)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [eventTarget])
}
