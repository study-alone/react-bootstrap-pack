import { getWindow } from './getWindow'
import { offset } from './offset'

/**
 * Returns the width of a given element.
 *
 * @param node the element
 * @param client whether to use `clientWidth` if possible
 */
export const width = (node: HTMLElement, client?: boolean) => {
	const win = getWindow(node)
	return win ? window.innerWidth : client ? node.clientWidth : offset(node).width
}
