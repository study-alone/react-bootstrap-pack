import { useEffect, useState } from 'react'
import { canUseDOM, ownerDocument } from '@repo/dom-helper'
import { useWindow } from './useWindow'
import type { VirtualElement } from './usePopper'

export type DOMContainer<T extends HTMLElement | VirtualElement = HTMLElement> =
	| T
	| React.RefObject<T>
	| null
	| (() => T | React.RefObject<T> | null)

export const resolveContainerRef = <T extends HTMLElement | VirtualElement>(
	ref: DOMContainer<T> | undefined,
	document?: Document,
) => {
	if (!canUseDOM) return null
	if (ref == null) return (document || ownerDocument()).body as HTMLBodyElement
	if (typeof ref === 'function') ref = ref()

	if (ref && 'current' in ref) ref = ref.current

	// || ref.getBoundingClientRect
	if (ref && 'nodeType' in ref) return ref

	return null
}

export const useWaitForDOMRef = <T extends HTMLElement | VirtualElement = HTMLElement>(
	ref: DOMContainer<T> | undefined,
	onResolved?: (element: T | HTMLBodyElement) => void,
) => {
	const window = useWindow()
	const [resolvedRef, setRef] = useState(() => resolveContainerRef(ref, window?.document))

	if (!resolvedRef) {
		const earlyRef = resolveContainerRef(ref)
		if (earlyRef) setRef(earlyRef)
	}

	useEffect(() => {
		if (onResolved && resolvedRef) {
			onResolved(resolvedRef)
		}
	}, [onResolved, resolvedRef])

	useEffect(() => {
		const nextRef = resolveContainerRef(ref)
		if (nextRef !== resolvedRef) {
			setRef(nextRef)
		}
	}, [ref, resolvedRef])

	return resolvedRef
}
