import { collectElements } from './collectElements'

/**
 * 주어진 요소의 모든 부모 요소를 수집합니다.
 *
 * @param node the element
 */
export const parents = (node: Element | null) => {
	return collectElements(node, 'parentElement')
}
