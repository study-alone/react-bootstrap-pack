import { getComputedStyle } from './getComputedStyle'
import { hyphenateStyleName } from './hyphenateStyle'
import { isTransform } from './isTransform'
import type {
	// CamelProperty,
	// HyphenProperty,
	Property,
	// PropertiesHyphen,
	// Properties,
} from './types'

// function style(
// 	node: HTMLElement,
// 	property: Partial<Record<Property, string>>,
// ): void
// function style<T extends HyphenProperty>(
// 	node: HTMLElement,
// 	property: T,
// ): PropertiesHyphen[T]
// function style<T extends CamelProperty>(
// 	node: HTMLElement,
// 	property: T | Record<Property, string | number>,
// ): Properties[T]
function style<T extends Property>(
	node: HTMLElement,
	property: T | Record<Property, string | number> | Partial<Record<Property, string>>,
) {
	let css = ''
	let transforms = ''

	if (typeof property === 'string') {
		const prop = hyphenateStyleName(property)
		return node.style.getPropertyValue(prop) || getComputedStyle(node).getPropertyValue(prop)
	}

	const typedProperty = property

	Object.entries(typedProperty).forEach(([key, value]) => {
		// const typedKey = key as Property

		if (!value && value !== 0) {
			node.style.removeProperty(hyphenateStyleName(key))
		} else if (isTransform(key)) {
			transforms += `${key}(${value})`
		} else {
			css += `${hyphenateStyleName(key)}: ${value}`
		}
	})

	if (transforms) {
		css += `transform: ${transforms};`
	}

	node.style.cssText = `;${css}`
}

export { style }
