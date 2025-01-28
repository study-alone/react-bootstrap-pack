import { isDocument } from './isDocument'

export const getWindow = (node: Element | Document | Window) => {
	if ('window' in node && node.window === node) {
		return node
	}

	if (isDocument(node)) {
		return node.defaultView || null
	}

	return null
}
