export const useSetRef = <T>(ref: React.Ref<T> | undefined) => {
	return (node: T) => {
		if (typeof ref === 'function') {
			ref(node)
		} else if (ref != null) {
			ref.current = node
		}
	}
}
