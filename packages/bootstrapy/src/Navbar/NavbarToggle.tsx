import { useContext } from 'react'
import clsx from 'clsx'
import { useEventCallback } from '@repo/restart-hooks'
import { useBootstrapPrefix } from '../hooks/useBootstrapPrefix'
import { NavbarContext } from './NavbarContext'
import type { BsPrefixProps } from '../types'

export interface NavbarToggleProps extends BsPrefixProps, React.HTMLAttributes<HTMLElement> {
	label?: string
	ref?: React.Ref<HTMLElement>
}

export const NavbarToggle = ({
	bsPrefix,
	className,
	children,
	label = 'Toggle navigation',
	// styled-components와 호환되도록 prop destructuring 중 기본 "as"를 정의해야 함
	// github.com/react-bootstrap/react-bootstrap/issues/3595
	as: Component = 'button',
	onClick,
	ref,
	...restProps
}: NavbarToggleProps) => {
	const prefix = useBootstrapPrefix(bsPrefix, 'navbar-toggler')
	const context = useContext(NavbarContext)

	const handleClick = useEventCallback((event: React.MouseEvent<HTMLElement, MouseEvent>) => {
		if (onClick) onClick(event)
		if (context?.onToggle) context.onToggle()
	})

	const buttonTypeProps: { type?: 'button' } = {}
	if (Component === 'button') {
		buttonTypeProps.type = 'button'
	}

	return (
		<Component
			{...restProps}
			{...buttonTypeProps}
			ref={ref}
			onClick={handleClick}
			aria-label={label}
			className={clsx(className, prefix, {
				collapsed: !context?.expanded,
			})}
		>
			{children || <span className={`${prefix}-icon`} />}
		</Component>
	)
}
