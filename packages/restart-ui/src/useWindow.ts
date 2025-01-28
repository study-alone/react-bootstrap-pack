import { createContext, useContext } from 'react'

const canUseDOM = !!(
	typeof window !== 'undefined' &&
	window.document &&
	window.document.createElement
)

export const WindowContext = createContext(canUseDOM ? window : undefined)

/**
 * The document "window" placed in React context. Helpful for determining
 * SSR context, or when rendering into an iframe.
 *
 * @returns the current window
 */
export const useWindow = () => {
	return useContext(WindowContext)
}
