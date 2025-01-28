import { ownerDocument } from './ownerDocument'

/**
 * Returns the owner window of a element.
 *
 * @param node th element
 */
export function ownerWindow(node?: Element) {
	const doc = ownerDocument(node)
	return (doc && doc.defaultView) || window
}
