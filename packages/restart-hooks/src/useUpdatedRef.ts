import { useRef } from 'react'

/**
 * Returns a ref that is immediately updated with the new value
 *
 * @param value The Ref value
 * @category refs
 */
export const useUpdatedRef = <T>(value: T) => {
	const valueRef = useRef<T>(value)
	valueRef.current = value
	return valueRef
}
