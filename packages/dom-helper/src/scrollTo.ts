import { height } from './height'
import { getWindow } from './getWindow'
import { offset as getOffset } from './offset'
import { scrollParent as getScrollParent } from './scrollParent'
import { scrollTop } from './scrollTop'

export const scrollTo = (selected: HTMLElement, scrollParent?: HTMLElement) => {
	let offset = getOffset(selected)
	let poff = { top: 0, left: 0 }

	if (!selected) {
		return undefined
	}

	const list = scrollParent || (getScrollParent(selected) as HTMLElement)
	const isWin = getWindow(list)
	let listScrollTop = scrollTop(list)

	const listHeight = height(list, true)

	if (!isWin) {
		poff = getOffset(list)
	}

	offset = {
		top: offset.top - poff.top,
		left: offset.left - poff.left,
		height: offset.height,
		width: offset.width,
	}

	const selectedHeight = offset.height
	const selectedTop = offset.top + (isWin ? 0 : listScrollTop)
	const bottom = selectedTop + selectedHeight

	if (listScrollTop > selectedTop) {
		listScrollTop = selectedTop
	} else if (bottom > listScrollTop + listHeight) {
		listScrollTop = bottom - listHeight
	}

	const id = requestAnimationFrame(() => scrollTop(list, listScrollTop))

	return () => {
		cancelAnimationFrame(id)
	}
}
