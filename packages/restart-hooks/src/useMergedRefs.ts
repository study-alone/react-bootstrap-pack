import { useMemo } from 'react'

type Ref<T> = React.Ref<T>

// const toFnRef = <T>(ref?: Ref<T> | null) =>
// 	!ref || typeof ref === 'function'
// 		? ref
// 		: (value: T) => {
// 				ref.current = value
// 			}

// export const mergeRefs = <T>(refA?: Ref<T> | null, refB?: Ref<T> | null) => {
// 	const a = toFnRef(refA)
// 	const b = toFnRef(refB)

// 	return (value: T | null) => {
// 		if (a) a(value as T)
// 		if (b) b(value as T)
// 	}
// }

export const mergeRefs = <T>(...refs: (Ref<T> | undefined)[]) => {
	// console.warn('@@@@@@@', refs)
	return (node: T) => {
		refs.forEach((ref) => {
			if (typeof ref === 'function') {
				ref(node)
			} else if (ref != null && typeof ref !== 'undefined') {
				ref.current = node
			}
		})
	}
}

/**
 * Create and returns a single callback ref composed from two other Refs.
 *
 * ```tsx
 * const Button = React.forwardRef((props, ref) => {
 *   const [element, attachRef] = useCallbackRef<HTMLButtonElement>();
 *   const mergedRef = useMergedRefs(ref, attachRef);
 *
 *   return <button ref={mergedRef} {...props}/>
 * })
 * ```
 *
 * @param refA A Callback or mutable Ref
 * @param refB A Callback or mutable Ref
 * @category refs
 */
export const useMergedRefs = <T>(
	...refs: (Ref<T> | undefined)[]
	// refA?: Ref<T> | null,
	// refB?: Ref<T> | null,
) => {
	return useMemo(() => mergeRefs<T>(...refs), [refs])
}
