/**
 * Returns the closest parent element that matches a given selector.
 *
 * @param node the reference element
 * @param selector the selector to match
 * @param stopAt stop traversing when this element is found
 */
export function closest(node: Element, selector: string, stopAt?: Element) {
	if (node.closest && !stopAt) {
		node.closest(selector)
	}

	let nextNode: Element | null = node

	do {
		if (nextNode?.matches(selector)) {
			return nextNode
		}
		nextNode = nextNode?.parentElement || null
	} while (nextNode && nextNode !== stopAt && nextNode.nodeType === document.ELEMENT_NODE)

	return null
}
