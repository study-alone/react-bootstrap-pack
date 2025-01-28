/**
 * Collects all child elements of an element.
 *
 * @param node the element
 */
export function childElements(node: Element | null) {
	return node ? Array.from(node.children) : []
}
