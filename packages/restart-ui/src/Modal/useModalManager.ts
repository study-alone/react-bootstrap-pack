import { useCallback, useRef } from 'react'
import { useWindow } from '../useWindow'
import { ModalManager } from './ModalManager'
import { getManager } from './getModalManager'
import type { ModalInstance } from './ModalManager'

type Modal = {
	[K in keyof ModalInstance]: ModalInstance[K] | null
}

export const useModalManager = (provided?: ModalManager) => {
	const window = useWindow()
	const modalManager = provided || getManager(window)

	const modal = useRef<Modal>({
		backdrop: null,
		dialog: null,
	})

	return Object.assign(modal.current || {}, {
		add: () => {
			if (ModalManager.validModalInstance(modal.current)) {
				modalManager.add(modal.current)
			}
		},
		remove: () => {
			if (ModalManager.validModalInstance(modal.current)) {
				modalManager.remove(modal.current)
			}
		},
		isTopModal: () => {
			if (ModalManager.validModalInstance(modal.current)) {
				return modalManager.isTopModal(modal.current)
			}
			return false
		},
		setDialogRef: useCallback((ref: HTMLElement | null) => {
			modal.current.dialog = ref
		}, []),
		setBackdropRef: useCallback((ref: HTMLElement | null) => {
			modal.current.backdrop = ref
		}, []),
	})
}
