import * as React from 'react'
import { useButtonProps } from './useButtonProps'

export { useButtonProps }

export interface BaseButtonProps<A = keyof React.JSX.IntrinsicElements> {
	/**
	 * 유효한 Component 유형을 전달하여 기본 렌더링 요소를 직접 제어합니다.
	 */
	as?: A

	/** The disabled state of the button */
	disabled?: boolean | undefined

	/** Optionally specify an href to render a `<a>` tag styled as a button */
	href?: string | undefined

	/** Anchor target, when rendering an anchor as a button */
	target?: string | undefined

	rel?: string | undefined

	ref?: A extends keyof React.JSX.IntrinsicElements
		? React.Ref<React.JSX.IntrinsicElements[A]>
		: never
}

type IntrinsicElementProps<A extends keyof React.JSX.IntrinsicElements> =
	React.JSX.IntrinsicElements[A]

export type ButtonProps<A extends keyof React.JSX.IntrinsicElements> = BaseButtonProps<A> &
	IntrinsicElementProps<A>

export const Button = <A extends keyof React.JSX.IntrinsicElements>({
	ref,
	as: asProp,
	disabled,
	...restProps
}: ButtonProps<A>) => {
	const [buttonProps, { tagName: Component }] = useButtonProps({
		tagName: asProp,
		disabled,
		...restProps,
	})

	return <Component {...restProps} {...buttonProps} ref={ref} />
}
