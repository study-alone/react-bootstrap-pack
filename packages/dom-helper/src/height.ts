import { getWindow } from './getWindow'
import { offset } from './offset'

/**
 * Returns the height of a given element.
 *
 * @param node the element
 * @param client whether to use `clientHeight` if possible
 */
export const height = (node: HTMLElement, client?: boolean) => {
	const window = getWindow(node)
	let height: number

	if (window) {
		height = window.innerHeight
	} else if (client) {
		height = node.clientHeight
	} else {
		height = offset(node).height
	}

	return height
}
