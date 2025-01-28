import type { BsPrefixProps } from '../types'

export type NumberAttr =
	| number
	| '1'
	| '2'
	| '3'
	| '4'
	| '5'
	| '6'
	| '7'
	| '8'
	| '9'
	| '10'
	| '11'
	| '12'
type ColOrderNumber = number | '1' | '2' | '3' | '4' | '5'
export type ColOrder = ColOrderNumber | 'first' | 'last'
export type ColSize = boolean | 'auto' | NumberAttr

type ColSpec = ColSize | { span?: ColSize; offset?: NumberAttr; order?: ColOrder }

export interface ColProps extends BsPrefixProps, React.HTMLAttributes<HTMLElement> {
	xs?: ColSpec
	sm?: ColSpec
	md?: ColSpec
	lg?: ColSpec
	xl?: ColSpec
	xxl?: ColSpec
	ref?: React.Ref<HTMLElement>
	// [key: string]: any
	htmlFor?: string
}
