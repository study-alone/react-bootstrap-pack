type TraverseDirection = 'parentElement' | 'previousElementSibling' | 'nextElementSibling'

export const collectElements = (node: Element | null, direction: TraverseDirection) => {
	let nextNode: Element | null = null
	const nodes: Element[] = []

	nextNode = node ? node[direction] : null

	while (nextNode && nextNode.nodeType !== 9) {
		nodes.push(nextNode)
		nextNode = nextNode[direction] || null
	}

	return nodes
}
