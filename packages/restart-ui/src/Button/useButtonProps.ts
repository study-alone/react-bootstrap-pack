import { isTrivialHref } from '../isTrivialHref'

export interface AriaButtonProps {
	type?: ButtonType | undefined
	disabled?: boolean | undefined
	role?: React.AriaRole
	tabIndex?: number | undefined
	href?: string | undefined
	target?: string | undefined
	rel?: string | undefined
	'aria-disabled'?: true | undefined
	onClick?: (event: React.MouseEvent | React.KeyboardEvent) => void
	onKeyDown?: (event: React.KeyboardEvent) => void
}

export type ButtonType = 'button' | 'reset' | 'submit'

export interface AnchorOptions {
	href?: string
	rel?: string
	target?: string
}

export interface UseButtonPropsOptions extends AnchorOptions {
	type?: ButtonType
	disabled?: boolean
	onClick?: React.EventHandler<React.MouseEvent | React.KeyboardEvent>
	tabIndex?: number
	tagName?: keyof HTMLElementTagNameMap
	role?: React.AriaRole | undefined
}

export interface UseButtonPropsMetadata {
	tagName: React.ElementType | keyof HTMLElementTagNameMap
}

export function useButtonProps({
	tagName,
	disabled,
	href,
	target,
	rel,
	role,
	onClick = () => {},
	tabIndex = 0,
	type,
}: UseButtonPropsOptions): [AriaButtonProps, UseButtonPropsMetadata] {
	if (!tagName) {
		if (href != null || target != null || rel != null) {
			tagName = 'a'
		} else {
			tagName = 'button'
		}
	}

	const meta: UseButtonPropsMetadata = { tagName }
	if (tagName === 'button') {
		return [{ type: type || 'button', disabled }, meta]
	}

	const handleClick = (event: React.MouseEvent | React.KeyboardEvent) => {
		if (disabled || (tagName === 'a' && isTrivialHref(href))) {
			event.preventDefault()
		}

		if (disabled) {
			event.stopPropagation()
			return
		}

		onClick(event)
	}

	const handleKeyDown = (event: React.KeyboardEvent) => {
		if (event.key === ' ') {
			event.preventDefault()
			handleClick(event)
		}
	}

	if (tagName === 'a') {
		// Enter를 누르면 anchor button이 trigger될 수 있도록 href가 있는지 확인
		href ||= '#'
		if (disabled) {
			href = undefined
		}
	}

	return [
		{
			role: role ?? 'button',
			// spread에서 비활성화된 prop을 재정의하도록 명시적으로 정의 되지 않은 경우
			// e.g. <Tag {...props} {...hookProps} />
			disabled: undefined,
			tabIndex: disabled ? undefined : tabIndex,
			href,
			target: tagName === 'a' ? target : undefined,
			'aria-disabled': !disabled ? undefined : disabled,
			rel: tagName === 'a' ? rel : undefined,
			onClick: handleClick,
			onKeyDown: handleKeyDown,
		},
		meta,
	]
}
