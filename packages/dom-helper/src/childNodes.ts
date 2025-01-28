// const toArray = Function.prototype.bind.call(Function.prototype.call, [].slice)

/**
 * Collects all child nodes of an element.
 *
 * @param node the node
 */
export function childNodes(node: Element | null) {
	return node ? Array.from(node.childNodes) : []
}
