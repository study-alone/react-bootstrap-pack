/**
 * Get the width of the vertical window scrollbar if it's visible
 */
export const getBodyScrollbarWidth = (ownerDocument = document) => {
	const window = ownerDocument.defaultView!

	return Math.abs(window.innerWidth - ownerDocument.documentElement.clientWidth)
}
