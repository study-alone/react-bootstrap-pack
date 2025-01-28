/**
 * 주어진 요소를 부모 요소의 첫 번째 자식으로 삽입합니다.
 *
 * @param node the element to prepend
 * @param parent the parent element
 */
export const prepend = (node: Element | null, parent: Element | null) => {
	if (node && parent) {
		if (parent.firstElementChild) {
			parent.insertBefore(node, parent.firstElementChild)
		} else {
			parent.appendChild(node)
		}
		return node
	}
	return null
}
