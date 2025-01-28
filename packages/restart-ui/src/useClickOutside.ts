import { useCallback, useEffect, useRef } from 'react'
import warning from 'warning'
import { useEventCallback } from '@repo/restart-hooks'
import { contains, ownerDocument } from '@repo/dom-helper'

const noop = () => {}

export type MouseEvents = {
	[K in keyof GlobalEventHandlersEventMap]: GlobalEventHandlersEventMap[K] extends MouseEvent
		? K
		: never
}[keyof GlobalEventHandlersEventMap]

function isLeftClickEvent(event: MouseEvent) {
	return event.button === 0
}

function isModifiedEvent(event: MouseEvent) {
	return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)
}

export const getRefTarget = (ref: React.RefObject<Element> | Element | null | undefined) =>
	ref && ('current' in ref ? ref.current : ref)

export interface ClickOutsideOptions {
	disabled?: boolean
	clickTrigger?: MouseEvents
}

const InitialTriggerEvents: Partial<Record<MouseEvents, MouseEvents>> = {
	click: 'mousedown',
	mouseup: 'mousedown',
	pointerup: 'pointerdown',
}

/**
 * `useClickOutside`는 제공된 참조 또는 요소 외부에서 포인터 이벤트가 등록될 때 실행되는 콜백을 document에 등록합니다.
 *
 * @param {Ref<HTMLElement>| HTMLElement} ref  The element boundary
 * @param {function} onClickOutside
 * @param {object=}  options
 * @param {boolean=} options.disabled
 * @param {string=}  options.clickTrigger The DOM event name (click, mousedown, etc) to attach listeners on
 */
export function useClickOutside(
	ref: React.RefObject<Element> | Element | null | undefined,
	onClickOutside: (event: React.MouseEvent | React.KeyboardEvent | Event) => void = noop,
	{ disabled, clickTrigger = 'click' }: ClickOutsideOptions = {},
) {
	const preventMouseClickOutsideRef = useRef(false)
	const waitingForTrigger = useRef(false)

	const handleMouseCapture = useCallback(
		(event: MouseEvent) => {
			const currentTarget = getRefTarget(ref)

			warning(
				!!currentTarget,
				'ClickOutside captured a close event but does not have a ref to compare it to. ' +
					'useClickOutside(), should be passed a ref that resolves to a DOM node',
			)

			preventMouseClickOutsideRef.current =
				!currentTarget ||
				isModifiedEvent(event) ||
				!isLeftClickEvent(event) ||
				!!contains(currentTarget, event.target as Element) ||
				waitingForTrigger.current

			waitingForTrigger.current = false
		},
		[ref],
	)

	const handleInitialMouse = useEventCallback((event: MouseEvent) => {
		const currentTarget = getRefTarget(ref)

		if (currentTarget && contains(currentTarget, event.target as Element)) {
			waitingForTrigger.current = true
		} else {
			/**
			 * 현재 대상 내에서 스크롤바를 클릭할 때 클릭 이벤트가 트리거되지 않으므로
			 * 이 참조는 `handleMouseCapture` 내부에서 재설정되지 않습니다.
			 * 이렇게 하면 오버레이를 닫으려면 2번 클릭해야 하는 버그가 발생합니다.
			 */
			waitingForTrigger.current = false
		}
	})

	const handleMouse = useEventCallback((event: React.MouseEvent | Event) => {
		if (!preventMouseClickOutsideRef.current) {
			onClickOutside(event)
		}
	})

	useEffect(() => {
		if (disabled || ref == null) return undefined

		const doc = ownerDocument(getRefTarget(ref)!)
		const ownerWindow = doc.defaultView || window

		/**
		 * 핸들러를 즉시 트리거하지 않으려면 현재 이벤트를 저장합니다.
		 * iframe에서 렌더링된 항목의 경우 이벤트는 부모 창에서 시작될 수 있으므로
		 * 로컬 이벤트가 없으면 해당 글로벌 이벤트로 돌아가야 합니다.
		 * @see https://github.com/facebook/react/issues/20074
		 */
		let currentEvent = ownerWindow.event ?? ownerWindow.parent?.event

		let removeInitialTriggerListener: (() => void) | null = null
		if (InitialTriggerEvents[clickTrigger]) {
			const type = InitialTriggerEvents[clickTrigger]
			const handler = handleInitialMouse || (() => {})

			removeInitialTriggerListener = (() => {
				doc.addEventListener(type, handler, true)
				return () => {
					doc.removeEventListener(type, handler, true)
				}
			})()
		}

		/**
		 * React 마우스 콜백에서 대상 DOM 요소가 제거된 경우
		 * 아래의 contains() 검사에서 거짓 긍정을 방지하기 위해
		 * 이 리스너에 capture를 사용하여 React 리스너보다 먼저 실행되도록 합니다.
		 */
		const removeMouseCaptureListener = (() => {
			doc.addEventListener(clickTrigger, handleMouseCapture, true)
			return () => {
				doc.removeEventListener(clickTrigger, handleMouseCapture, true)
			}
		})()

		const removeMouseListener = (() => {
			// 이 이벤트가 핸들러를 추가할 때 실행 중이던 이벤트와 동일하면 건너뜁니다.
			const handler = (event: Event) => {
				if (event === currentEvent) {
					currentEvent = undefined
					return
				}
				handleMouse?.(event)
			}
			doc.addEventListener(clickTrigger, handler)

			return () => {
				doc.removeEventListener(clickTrigger, handler)
			}
		})()

		let mobileSafariHackListeners: (() => void)[] = []
		if ('ontouchstart' in doc.documentElement) {
			mobileSafariHackListeners = [].slice
				.call(doc.body.children)
				.map((element: HTMLElement) => {
					return (() => {
						element.addEventListener('mousemove', noop)

						return () => {
							element.removeEventListener('mousemove', noop)
						}
					})()
				})
		}

		return () => {
			removeInitialTriggerListener?.()
			removeMouseCaptureListener()
			removeMouseListener()
			mobileSafariHackListeners.forEach((remove) => remove())
		}
	}, [ref, disabled, clickTrigger, handleMouseCapture, handleInitialMouse, handleMouse])
}
