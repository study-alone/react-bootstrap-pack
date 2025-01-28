import { style, addClass, querySelectorAll, removeClass } from '@repo/dom-helper'
import { ModalManager } from '@repo/restart-ui/Modal/ModalManager'
import type { ContainerState, ModalManagerOptions } from '@repo/restart-ui/Modal/ModalManager'

type CSSPropsKeys = 'paddingLeft' | 'paddingRight' | 'marginLeft' | 'marginRight'

export class BootstrapModalManager extends ModalManager {
	private Selector = {
		FIXED_CONTENT: '.fixed-top, .fixed-bottom, .is-fixed, .sticky-top',
		STICKY_CONTENT: '.sticky-top',
		NAVBAR_TOGGLER: '.navbar-toggler',
	}

	private adjustAndStore(prop: CSSPropsKeys, element: HTMLElement, adjust: number) {
		const actual = element.style[prop as keyof CSSStyleDeclaration]

		element.dataset[prop] = JSON.stringify(actual)
		style(element, {
			/** @note DOMStringMap and CSSStyleDeclaration aren't strictly compatible */
			[prop]: `${parseFloat(style(element, prop) || '0') + adjust}px`,
		})
	}

	private restore(prop: CSSPropsKeys, element: HTMLElement) {
		const value = element.dataset[String(prop)]
		if (value !== undefined) {
			delete element.dataset[prop]
			style(element, { [prop]: value })
		}
	}

	setContainerStyle(containerState: ContainerState) {
		super.setContainerStyle(containerState)

		const container = this.getElement()

		addClass(container, 'modal-open')

		if (!containerState.scrollBarWidth) return

		const paddingProp = this.isRTL ? 'paddingLeft' : 'paddingRight'
		const marginProp = this.isRTL ? 'marginLeft' : 'marginRight'

		const Selector = this.Selector
		querySelectorAll(container, Selector.FIXED_CONTENT).forEach((element) =>
			this.adjustAndStore(paddingProp, element, containerState.scrollBarWidth),
		)
		querySelectorAll(container, Selector.STICKY_CONTENT).forEach((element) =>
			this.adjustAndStore(marginProp, element, -containerState.scrollBarWidth),
		)
		querySelectorAll(container, Selector.NAVBAR_TOGGLER).forEach((element) =>
			this.adjustAndStore(marginProp, element, containerState.scrollBarWidth),
		)
	}

	removeContainerStyle(containerState: ContainerState) {
		super.removeContainerStyle(containerState)

		const container = this.getElement()
		removeClass(container, 'modal-open')

		const paddingProp = this.isRTL ? 'paddingLeft' : 'paddingRight'
		const marginProp = this.isRTL ? 'marginLeft' : 'marginRight'

		const Selector = this.Selector
		querySelectorAll(container, Selector.FIXED_CONTENT).forEach((element) =>
			this.restore(paddingProp, element),
		)
		querySelectorAll(container, Selector.STICKY_CONTENT).forEach((element) =>
			this.restore(marginProp, element),
		)
		querySelectorAll(container, Selector.NAVBAR_TOGGLER).forEach((element) =>
			this.restore(marginProp, element),
		)
	}
}

let sharedManager: BootstrapModalManager | undefined

export function getSharedManager(options?: ModalManagerOptions) {
	if (!sharedManager) sharedManager = new BootstrapModalManager(options)

	return sharedManager
}
