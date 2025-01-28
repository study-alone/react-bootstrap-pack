/**
 * Gets or sets an attribute of a given element.
 *
 * @param node the element
 * @param attr the attribute to get or set
 * @param val the attribute value
 */

export function attribute(node: Element | null, attr: string, value?: string | boolean | null) {
	if (node) {
		if (typeof value === 'undefined') {
			return node.getAttribute(attr)
		}

		if (!value && value !== '') {
			node.removeAttribute(attr)
		} else {
			node.setAttribute(attr, String(value))
		}
	}
}
