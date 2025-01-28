import type { PropertiesHyphen as CSSPropertiesHyphen, Properties as CSSProperties } from 'csstype'

// type Styles = keyof CSSStyleDeclaration

export type HyphenProperty = keyof CSSPropertiesHyphen
export type CamelProperty = keyof CSSProperties

export type PropertiesHyphen<
	TLength = 0 | (string & {}),
	TTime = string & {},
> = CSSPropertiesHyphen<TLength, TTime>

export type Properties<TLength = 0 | (string & {}), TTime = string & {}> = CSSProperties<
	TLength,
	TTime
>

export type Property = HyphenProperty | CamelProperty
