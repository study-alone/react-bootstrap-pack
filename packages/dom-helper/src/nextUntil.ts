import { collectSiblings } from './collectSiblings'

/**
 * 주어진 선택자가 일치할 때까지 요소의 모든 next sibling element를 수집합니다.
 *
 * @param node the referene node
 * @param selector the selector to match
 */
export const nextUntil = (node: Element | null, selector: string) => {
	return collectSiblings(node, node, selector)
}
