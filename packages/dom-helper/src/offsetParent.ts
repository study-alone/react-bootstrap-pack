import { style } from './css'
import { ownerDocument } from './ownerDocument'

const isHTMLElement = (element: Element | null): element is HTMLElement =>
	!!element && 'offsetParent' in element

export const offsetParent = (node: HTMLElement) => {
	const doc = ownerDocument(node)
	let parent = node && node.offsetParent

	while (
		isHTMLElement(parent) &&
		parent.nodeName !== 'HTML' &&
		style(parent, 'position') === 'static'
	) {
		parent = parent.offsetParent
	}

	return (parent || doc.documentElement) as HTMLElement
}
