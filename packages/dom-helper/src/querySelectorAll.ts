// const toArray = Function.prototype.bind.call(Function.prototype.call, [].slice)

/**
 * Runs `querySelectorAll` on a given element.
 *
 * @param element the element
 * @param selector the selector
 */
export const querySelectorAll = (element: HTMLElement | Document, selector: string) => {
	return Array.from(element.querySelectorAll<HTMLElement>(selector))
}
