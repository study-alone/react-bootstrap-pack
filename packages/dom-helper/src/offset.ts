import { contains } from './contains'
import { ownerDocument } from './ownerDocument'
import { scrollLeft } from './scrollLeft'
import { scrollTop } from './scrollTop'

/**
 * 위쪽, 왼쪽 위치, 너비, 높이를 포함하여 주어진 요소의 오프셋을 반환합니다.
 *
 * @param node the element
 */
export const offset = (node: HTMLElement) => {
	const doc = ownerDocument(node)

	let box = { top: 0, left: 0, height: 0, width: 0 }
	const documentElement = doc && doc.documentElement

	// 연결이 끊긴 DOM 노드가 아닌지 확인하세요.
	if (!documentElement || !contains(documentElement, node)) {
		return box
	}

	if (node.getBoundingClientRect !== undefined) {
		box = node.getBoundingClientRect()
	}

	box = {
		top: box.top + scrollTop(documentElement) - (documentElement.clientTop || 0),
		left: box.left + scrollLeft(documentElement) - (documentElement.clientLeft || 0),
		width: box.width,
		height: box.height,
	}

	return box
}
