import { ModalManager } from './ModalManager'

let manager: ModalManager

export const getManager = (window?: Window) => {
	if (!manager) manager = new ModalManager({ ownerDocument: window?.document })
	return manager
}
