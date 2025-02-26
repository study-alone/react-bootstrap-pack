import { ownerWindow } from './ownerWindow'

/**
 * Returns one or all computed style properties of an element.
 *
 * @param node the element
 * @param psuedoElement the style property
 */
export function getComputedStyle(node: HTMLElement, psuedoElement?: string) {
	return ownerWindow(node).getComputedStyle(node, psuedoElement)
}
