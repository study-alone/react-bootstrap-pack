import * as React from 'react'
import { useButtonProps } from './useButtonProps'

export { useButtonProps }

type TagName<T extends HTMLElement> = {
	[K in keyof HTMLElementTagNameMap]: HTMLElementTagNameMap[K] extends T ? K : never
}[keyof HTMLElementTagNameMap]

export interface ButtonProps<T extends HTMLElement = HTMLButtonElement>
	extends React.ComponentPropsWithoutRef<'button'> {
	/**
	 * 유효한 Component 유형을 전달하여 기본 렌더링 요소를 직접 제어합니다.
	 */
	as?: TagName<T> | undefined

	/** 버튼의 활성화 여부를 결정 */
	disabled?: boolean | undefined

	/** 선택적으로`<a>`태그 스타일을 버튼으로 렌더링하기 위해 HREF를 지정합니다. */
	href?: string | undefined

	/** <a />로 렌더링할 때 target을 지정합니다. */
	target?: string | undefined

	/**
	 * link된 리소스와 현재 문서 간의 관계를 정의
	 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel
	 */
	rel?: string | undefined

	/** HTMLElement의 참조(`ref`) */
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
