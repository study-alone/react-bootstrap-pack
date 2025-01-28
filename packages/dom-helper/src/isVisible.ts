/**
 * 주어진 요소가 현재 보이는지 확인합니다.
 *
 * @param node the element to check
 */
export const isVisible = (node: HTMLElement | null) => {
	return node ? !!(node.offsetWidth || node.offsetHeight || node.getClientRects().length) : false
}
