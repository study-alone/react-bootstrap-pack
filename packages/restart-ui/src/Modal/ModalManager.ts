import { style } from '@repo/dom-helper'
import { dataAttr } from '../dataKey'
import { getBodyScrollbarWidth } from '../getBodyScrollbarWidth'

export interface ModalInstance {
	dialog: HTMLElement
	backdrop: HTMLElement
}

export interface ModalManagerOptions {
	ownerDocument?: Document
	handleContainerOverflow?: boolean
	isRTL?: boolean
}

export type ContainerState = {
	scrollBarWidth: number
	style: Record<string, string | number>
}

export const OPEN_DATA_ATTRIBUTE = dataAttr('modal-open')

/**
 * Manages a stack of Modals as well as ensuring
 * body scrolling is is disabled and padding accounted for
 */
export class ModalManager {
	readonly handleContainerOverflow: boolean
	readonly isRTL: boolean
	readonly modals: ModalInstance[]
	protected state!: ContainerState
	protected ownerDocument: Document | undefined

	constructor({
		ownerDocument,
		handleContainerOverflow = true,
		isRTL = false,
	}: ModalManagerOptions = {}) {
		this.handleContainerOverflow = handleContainerOverflow
		this.isRTL = isRTL
		this.modals = []
		this.ownerDocument = ownerDocument
	}

	getScrollbarWidth() {
		return getBodyScrollbarWidth(this.ownerDocument)
	}

	getElement() {
		return (this.ownerDocument || document).body
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	setModalAttributes(_modal: ModalInstance) {
		// for overriding
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	removeModalAttributes(_modal: ModalInstance) {
		// for overriding
	}

	setContainerStyle(containerState: ContainerState) {
		const styles: Partial<CSSStyleDeclaration> = { overflow: 'hidden' }
		// we are only interested in the actual `style` here
		// because we will override it
		const paddingProp = this.isRTL ? 'paddingLeft' : 'paddingRight'
		const container = this.getElement()

		containerState.style = {
			overflow: container.style.overflow,
			[paddingProp]: container.style[paddingProp],
		}

		if (containerState.scrollBarWidth) {
			// use computed style, here to get the real padding
			// to add our scrollbar width
			styles[paddingProp] = `${
				parseInt(style(container, paddingProp) || '0', 10) + containerState.scrollBarWidth
			}px`
		}

		container.setAttribute(OPEN_DATA_ATTRIBUTE, '')

		style(container, styles)
	}

	reset() {
		;[...this.modals].forEach((modal) => this.remove(modal))
	}

	removeContainerStyle(containerState: ContainerState) {
		const container = this.getElement()
		container.removeAttribute(OPEN_DATA_ATTRIBUTE)
		Object.assign(container.style, containerState.style)
	}

	add(modal: ModalInstance) {
		let modalIdx = this.modals.indexOf(modal)

		if (modalIdx !== -1) {
			return modalIdx
		}

		modalIdx = this.modals.length
		this.modals.push(modal)
		this.setModalAttributes(modal)
		if (modalIdx !== 0) {
			return modalIdx
		}

		this.state = {
			scrollBarWidth: this.getScrollbarWidth(),
			style: {},
		}

		if (this.handleContainerOverflow) {
			this.setContainerStyle(this.state)
		}

		return modalIdx
	}

	remove(modal: ModalInstance) {
		const modalIdx = this.modals.indexOf(modal)

		if (modalIdx === -1) {
			return
		}

		this.modals.splice(modalIdx, 1)

		// if that was the last modal in a container,
		// clean up the container
		if (!this.modals.length && this.handleContainerOverflow) {
			this.removeContainerStyle(this.state)
		}

		this.removeModalAttributes(modal)
	}

	isTopModal(modal: ModalInstance) {
		return !!this.modals.length && this.modals[this.modals.length - 1] === modal
	}

	static validModalInstance(modal: {
		dialog: unknown
		backdrop: unknown
	}): modal is ModalInstance {
		return modal.backdrop instanceof HTMLElement && modal.dialog instanceof HTMLElement
	}
}
