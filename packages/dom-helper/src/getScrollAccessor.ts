import { getWindow } from './getWindow'

export const getScrollAccessor = (offset: 'pageXOffset' | 'pageYOffset') => {
	const prop: 'scrollLeft' | 'scrollTop' = offset === 'pageXOffset' ? 'scrollLeft' : 'scrollTop'

	function scrollAccessor(node: Element): number
	function scrollAccessor(node: Element, value: number): void
	function scrollAccessor(node: Element, value?: number) {
		const win = getWindow(node)

		if (value === undefined) {
			return win ? win[offset] : node[prop]
		}

		if (win) {
			win.scrollTo(win[offset], value)
		} else {
			node[prop] = value
		}
	}

	return scrollAccessor
}
