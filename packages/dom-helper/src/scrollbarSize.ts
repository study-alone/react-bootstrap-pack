import { canUseDOM } from './canUseDOM'

let size: number
const setStyles = (element: HTMLElement, styles: Partial<CSSStyleDeclaration>) => {
	Object.assign(element.style, styles)
}

export const scrollbarSize = (recalc?: boolean) => {
	if (!size || size !== 0 || recalc) {
		if (canUseDOM) {
			const scrollDiv = document.createElement('div')

			setStyles(scrollDiv, {
				position: 'absolute',
				top: '-9999px',
				width: '50px',
				height: '50px',
				overflow: 'scroll',
			})

			document.body.appendChild(scrollDiv)
			size = scrollDiv.offsetWidth - scrollDiv.clientWidth
			document.body.removeChild(scrollDiv)
		}
	}
	return size
}
