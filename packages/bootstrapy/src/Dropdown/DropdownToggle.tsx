import { useContext } from 'react'
import clsx from 'clsx'
import { useDropdownToggle, DropdownContext } from '@repo/restart-ui/Dropdown'
import { useMergedRefs } from '@repo/restart-hooks'
import { useBootstrapPrefix } from '../hooks/useBootstrapPrefix'
import { Button } from '../Button'
import type { ButtonProps, CommonButtonProps } from '../Button'

export type DropdownToggleProps<As extends React.ElementType = React.ElementType> = Omit<
	ButtonProps,
	'as'
> & {
	// as?: As
	split?: boolean
	childBsPrefix?: string
	component?: As
	componentProps?: React.ComponentProps<As>
}

export type PropsFromToggle = Partial<Pick<DropdownToggleProps, CommonButtonProps>>

export const DropdownToggle = <As extends React.ElementType>({
	ref,
	split,
	className,
	childBsPrefix,
	// for styled component
	// as: Component = Button,
	component,
	componentProps,
	...restProps
}: DropdownToggleProps<As>) => {
	const prefix = useBootstrapPrefix(restProps.bsPrefix, 'dropdown-toggle')
	const dropdownContext = useContext(DropdownContext)

	if (childBsPrefix !== undefined) {
		restProps.bsPrefix = childBsPrefix
	}

	const [toggleProps] = useDropdownToggle()
	toggleProps.ref = useMergedRefs<HTMLElement | null>(toggleProps.ref, ref)

	const Component = component ?? Button

	// 이렇게 하면 의도적으로 `size`와 `variant`(설정된 경우)를 기본 `component`에 전달하여
	// `size`와 `variant` 스타일이 렌더링되도록 할 수 있습니다.

	return (
		<Component
			className={clsx(className, prefix, {
				[`${prefix}-split`]: split,
				show: dropdownContext?.show,
			})}
			{...toggleProps}
			{...restProps}
			{...componentProps}
		/>
	)
}
