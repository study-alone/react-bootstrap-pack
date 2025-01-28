/**
 * Checks if an element contains another given element.
 *
 * @param context the context element
 * @param node the element to check
 */
export function contains(context: Element, node: Element) {
	/**
	 * HTML DOM과 SVG DOM은 지원 수준이 다를 수 있으므로
	 * 문서 루트 요소 대신 컨텍스트를 확인해야 합니다.
	 */
	if (context.contains) {
		return context.contains(node)
	}
	if (context.compareDocumentPosition) {
		return context === node || !!(context.compareDocumentPosition(node) & 16)
	}
}
