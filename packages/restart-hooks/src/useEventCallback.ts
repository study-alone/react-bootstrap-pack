import { useCallback } from 'react'
import { useCommittedRef } from './useCommittedRef'

// export function useEventCallback<Args extends unknown[], Return = void>(
// 	fn?: ((...args: Args) => Return) | null,
// ): ((...args: Args) => Return | undefined) | undefined {
// 	const ref = useCommittedRef(fn)

// 	return useCallback(
// 		(...args: Args): Return | undefined => {
// 			return ref.current ? ref.current(...args) : undefined
// 		},
// 		[ref],
// 	)
// }
export const useEventCallback = <A extends unknown[], R>(
	fn: ((...args: A) => R) | null,
): ((...args: A) => R) => {
	const ref = useCommittedRef(fn)

	return useCallback(
		(...args: A): R => {
			if (ref.current == null) {
				throw new Error(`[useEventCallback]: Callback is no available. ${ref.current}`)
			}
			return ref.current(...args)
		},
		[ref],
	)
}
