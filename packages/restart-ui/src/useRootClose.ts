import { useEventCallback } from '@repo/restart-hooks'
import { listen, ownerDocument } from '@repo/dom-helper'
import { useEffect } from 'react'
import { useClickOutside, getRefTarget } from './useClickOutside'
import { isEscKey } from './utils'
import type { ClickOutsideOptions } from './useClickOutside'

const noop = () => {}

export interface RootCloseOptions extends ClickOutsideOptions {
	disabled?: boolean
}

/**
 * `useRootClose`는 렌더링될 때 document에 콜백을 등록합니다. `<Overlay/>`를 작동합니다.
 * 이는 사용자가 document의 나머지 부분과 상호 작용하거나
 * `esc` 키를 누를 때 콜백이 트리거되는 모달 스타일 동작을 구현하는 데 사용됩니다.
 * @param {Ref<HTMLElement>| HTMLElement} ref  The element boundary
 * @param {function} onRootClose
 * @param {object=}  options
 * @param {boolean=} options.disabled
 * @param {string=}  options.clickTrigger The DOM event name (click, mousedown, etc) to attach listeners on
 */
export const useRootClose = (
	ref: React.RefObject<Element> | Element | null | undefined,
	onRootClose: (event: React.MouseEvent | React.KeyboardEvent | Event) => void,
	{ disabled, clickTrigger }: RootCloseOptions = {},
) => {
	const onClose = onRootClose || noop

	useClickOutside(ref, onClose, { disabled, clickTrigger })

	const handleKeyUp = useEventCallback((event: KeyboardEvent) => {
		if (isEscKey(event)) {
			onClose(event)
		}
	})

	useEffect(() => {
		if (disabled || ref == null) return

		const doc = ownerDocument(getRefTarget(ref) || undefined)

		/**
		 * window.event는 deprecated 되어 방식을 변경했습니다.
		 * **event를 저장하는 것이 아닌 event.timeStamp를 저장하여 이벤트가 동일한지 판단합니다.**
		 */
		// 핸들러가 즉시 트리거되지 않도록 현재 이벤트를 저장합니다.
		// https://github.com/facebook/react/issues/20074
		// const currentEvent = (doc.defaultView || window).event
		let currentEventTimestamp: number | undefined

		const removeKeyUpListener = listen(doc, 'keyup', (event) => {
			if (event.timeStamp === currentEventTimestamp) {
				currentEventTimestamp = undefined
				return
			}

			currentEventTimestamp = event.timeStamp

			handleKeyUp(event)
		})

		return () => {
			removeKeyUpListener()
		}
	}, [disabled, handleKeyUp, ref])
}
