export const ATTRIBUTE_PREFIX = `data-rr-ui-`

export const PROPERTY_PREFIX = `rrUi`

export function dataAttr<T extends string>(property: T) {
	return `${ATTRIBUTE_PREFIX}${property}` as const
}

export function dataProp<T extends string>(property: T) {
	return `${PROPERTY_PREFIX}${property}` as const
}
