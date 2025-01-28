const regExpInputs = /^(?:input|select|textarea|button)$/i

/**
 * 주어진 요소가 입력(input, select, textarea 또는 button)인지 확인합니다.
 *
 * @param node the element to check
 */
export const isInput = (node: Element | null) => {
	return node ? regExpInputs.test(node.nodeName) : false
}
