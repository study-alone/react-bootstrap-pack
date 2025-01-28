import { style } from './css'
import { height } from './height'
import { isDocument } from './isDocument'

/**
 * 요소의 첫 번째 스크롤 가능 부모를 찾습니다.
 *
 * @param element 시작 element
 * @param firstPossible 현재 스크롤할 수 없더라도 첫 번째 스크롤 가능한 부모에서 멈춥니다.
 */
export const scrollParent = (element: HTMLElement, firstPossible?: boolean) => {
	const position = style(element, 'position')
	const excludeStatic = position === 'absolute'
	const ownerDoc = element.ownerDocument

	if (position === 'fixed') {
		return ownerDoc || document
	}

	while ((element = element.parentNode as HTMLElement) && !isDocument(element)) {
		const isStatic = excludeStatic && style(element, 'position') === 'static'
		const overflowValue =
			(style(element, 'overflow') || '') +
			(style(element, 'overflow-y') || '') +
			style(element, 'overflow-x')

		if (isStatic) continue

		if (
			/(auto|scroll)/.test(overflowValue) &&
			(firstPossible || height(element) < element.scrollHeight)
		) {
			return element
		}
	}

	return ownerDoc || document
}
