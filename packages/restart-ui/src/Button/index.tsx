import * as React from 'react'
import { useButtonProps } from './useButtonProps'

export { useButtonProps }

type TagName<T extends HTMLElement> = {
	[K in keyof HTMLElementTagNameMap]: HTMLElementTagNameMap[K] extends T ? K : never
}[keyof HTMLElementTagNameMap]

export interface BaseButtonProps<T extends HTMLElement> {
	/**
	 * 유효한 Component 유형을 전달하여 기본 렌더링 요소를 직접 제어합니다.
	 */
	as?: TagName<T> | undefined

	/** The disabled state of the button */
	disabled?: boolean | undefined

	/** Optionally specify an href to render a `<a>` tag styled as a button */
	href?: string | undefined

	/** Anchor target, when rendering an anchor as a button */
	target?: string | undefined

	rel?: string | undefined
}

// type IntrinsicElementProps<A extends keyof HTMLElementTagNameMap> = keyof HTMLElementTagNameMap[A]

// export type ButtonProps<A extends keyof HTMLElementTagNameMap> = BaseButtonProps<A> &
// 	IntrinsicElementProps<A>

export interface ButtonProps<T extends HTMLElement = HTMLButtonElement>
	extends BaseButtonProps<T>,
		React.ComponentPropsWithoutRef<'button'> {
	ref?: React.Ref<T>
}

export const Button = ({ ref, as: asProp, disabled, ...restProps }: ButtonProps) => {
	const [buttonProps, { tagName: Component }] = useButtonProps({
		tagName: asProp,
		disabled,
		...restProps,
	})

	return <Component {...restProps} {...buttonProps} ref={ref} />
}
