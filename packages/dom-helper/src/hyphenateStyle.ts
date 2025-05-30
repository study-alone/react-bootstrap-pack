/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 * https://github.com/facebook/react/blob/2aeb8a2a6beb00617a4217f7f8284924fa2ad819/src/vendor/core/hyphenateStyleName.js
 */

import { hyphenate } from './hyphenate'
// import type { HyphenProperty, Property } from './types'

const msPattern = /^ms-/
export function hyphenateStyleName(string: string) {
	return hyphenate(string).replace(msPattern, '-ms-')
}
