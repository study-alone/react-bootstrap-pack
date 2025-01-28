import { collectSiblings } from './collectSiblings'

/**
 * 주어진 요소의 이전 및 다음 형제 요소를 모두 수집합니다.
 *
 * @param node the element
 */
export const siblings = (node: Element | null) => {
	return collectSiblings(
		node && node.parentElement ? node.parentElement.firstElementChild : null,
		node,
	)
}
