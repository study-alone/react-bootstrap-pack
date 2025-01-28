import clsx from 'clsx'
import {
	useDropdownItem,
	type DropdownItemProps as BaseDropdownItemProps,
} from '@repo/restart-ui/Dropdown'
import { Anchor } from '@repo/restart-ui/Anchor'
import { useBootstrapPrefix } from '../hooks/useBootstrapPrefix'
import type { BsPrefixProps } from '../types'

export interface DropdownItemProps extends BaseDropdownItemProps, BsPrefixProps {}

export const DropdownItem = ({
	bsPrefix,
	className,
	eventKey,
	disabled = false,
	onClick,
	active,
	as: Component = Anchor,
	ref,
	...restProps
}: DropdownItemProps) => {
	const prefix = useBootstrapPrefix(bsPrefix, 'dropdown-item')
	const [dropdownItemProps, meta] = useDropdownItem({
		key: eventKey,
		href: restProps.href,
		disabled,
		onClick,
		active,
	})

	return (
		<Component
			{...restProps}
			{...dropdownItemProps}
			ref={ref}
			className={clsx(className, prefix, {
				active: meta.isActive,
				disabled,
			})}
		/>
	)
}
