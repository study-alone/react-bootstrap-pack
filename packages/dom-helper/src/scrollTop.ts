import { getScrollAccessor } from './getScrollAccessor'

/**
 * Gets or sets the scroll top position of a given element.
 *
 * @param node the element
 * @param val the position to set
 */
export const scrollTop = getScrollAccessor('pageYOffset')
