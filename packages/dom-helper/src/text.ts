const regExpNbspEntity = /&nbsp;/gi
const regExpNbspHex = /\xA0/g
const regExpSpaces = /\s+([^\s])/gm

/**
 * 주어진 요소의 텍스트 콘텐츠를 수집합니다.
 *
 * @param node the element
 * @param trim whether to remove trailing whitespace chars
 * @param singleSpaces whether to convert multiple whitespace chars into a single space character
 */
export const text = (node: HTMLElement, trim = true, singleSpaces = true) => {
	let elementText: string | null = ''

	if (node) {
		elementText = (node.textContent || '')
			.replace(regExpNbspEntity, ' ')
			.replace(regExpNbspHex, ' ')
		if (trim) {
			elementText = elementText.trim()
		}
		if (singleSpaces) {
			elementText = elementText.replace(regExpSpaces, ' $1')
		}
	}

	return elementText
}
