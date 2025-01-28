import { useRef } from 'react'

export const useTimeout = () => {
	const timeoutIdRef = useRef<number>(undefined)

	return [
		(fn: () => void, ms?: number) => (timeoutIdRef.current = window.setTimeout(fn, ms)),
		() => window.clearTimeout(timeoutIdRef.current),
	]
}
