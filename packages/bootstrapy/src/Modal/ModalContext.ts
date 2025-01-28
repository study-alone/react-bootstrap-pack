import { createContext } from 'react'

interface ModalContextValue {
	onHide: () => void
}

export const ModalContext = createContext<ModalContextValue>({
	onHide() {},
})
