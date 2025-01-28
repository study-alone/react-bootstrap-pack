import { useRef } from 'react'
import { useEventCallback } from '@repo/restart-hooks'
import { useButtonProps } from './Button/useButtonProps'
import { isTrivialHref } from './isTrivialHref'

export interface AnchorProps extends React.HTMLAttributes<HTMLElement> {
	href?: string
	disabled?: boolean
	role?: string
	tabIndex?: number
	ref?: React.Ref<HTMLAnchorElement>
}

/**
 * 몇 가지 A11y 사례를 포괄하는 일반적인 `<a>` 구성 요소는 `href`가 누락되었거나
 * "#"과 같이 사소한 경우를 버튼처럼 처리합니다.
 */
export const Anchor = ({ ref, onKeyDown, children, ...restProps }: AnchorProps) => {
	const [buttonProps] = useButtonProps({ tagName: 'a', ...restProps })
	const replaceRef = useRef<HTMLAnchorElement>(null)

	const handleKeyDown = useEventCallback((event: React.KeyboardEvent<HTMLElement>) => {
		// buttonProps.onKeyDown!(event)
		onKeyDown?.(event)
	})

	if (isTrivialHref(restProps.href) || restProps.role === 'button') {
		return (
			<a
				ref={ref || replaceRef}
				role="button"
				tabIndex={restProps.tabIndex || buttonProps.tabIndex}
				{...restProps}
				{...buttonProps}
				onKeyDown={handleKeyDown}
			>
				{children}
			</a>
		)
	}

	return (
		<a ref={ref} role="link" {...restProps} tabIndex={restProps.tabIndex} onKeyDown={onKeyDown}>
			{children}
		</a>
	)
}
