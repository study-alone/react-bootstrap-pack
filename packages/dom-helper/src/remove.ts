/**
 * 주어진 node의 부모 node에서 주어진 node를 제거
 *
 * @param node the node to remove
 */
export const remove = (node: Node | null) => {
	if (node && node.parentNode) {
		node.parentNode.removeChild(node)
		return node
	}
	return null
}
