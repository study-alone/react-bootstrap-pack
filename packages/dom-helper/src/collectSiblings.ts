export const collectSiblings = (
	node: Element | null,
	refNode: Element | null = null,
	selector: string | null = null,
) => {
	const siblings: Element[] = []

	while (node && node !== refNode) {
		if (selector && node.matches(selector)) {
			break
		}

		siblings.push(node)
		node = node.nextElementSibling
	}

	return siblings
}
