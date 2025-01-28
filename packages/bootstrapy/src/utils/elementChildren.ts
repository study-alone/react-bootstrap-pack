const isValidElement = (reactElement: React.ReactNode): reactElement is React.ReactElement => {
	return (
		reactElement !== null &&
		typeof reactElement !== 'undefined' &&
		typeof reactElement !== 'number' &&
		typeof reactElement !== 'string' &&
		typeof reactElement !== 'number' &&
		typeof reactElement !== 'bigint'
	)
}

/**
 * Iterates through children that are typically specified as `props.children`, but only maps over children that are "valid elements".
 * 일반적으로 `props.children`으로 지정되는 자식을 반복하지만 "유효한 요소"인 자식에만 매핑합니다.
 *
 * The mapFunction provided index will be normalised to the components mapped, so an invalid component would not increase the index.
 * mapFunction에서 제공된 인덱스는 매핑된 구성 요소에 따라 정규화되므로, 유효하지 않은 구성 요소가 인덱스를 증가시키지 않습니다.
 *
 */
// function map<P>(
//     children,
//     function
// ) { }

/**
 * component의 `children` prop에 지정된 type의 React Element가 포함되어 있는지 확인합니다.
 */
export const hasChildOfType = <P = unknown>(
	children: React.ReactNode,
	type: string | React.JSXElementConstructor<P>,
) => {
	if (Array.isArray(children)) {
		return (children as React.ReactNode[]).some(
			(child) => isValidElement(child) && child.type === type,
		)
	}
	return isValidElement(children) && children.type === type
}
