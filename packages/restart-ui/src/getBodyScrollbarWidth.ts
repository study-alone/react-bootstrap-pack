/**
 * Get the width of the vertical window scrollbar if it's visible
 */
export const getBodyScrollbarWidth = (ownerDocument = document) => {
	const win = ownerDocument.defaultView || window

	return Math.abs(win.innerWidth - ownerDocument.documentElement.clientWidth)
}
