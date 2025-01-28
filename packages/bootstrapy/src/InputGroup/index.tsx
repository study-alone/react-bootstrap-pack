import { useMemo } from 'react'
import clsx from 'clsx'
import { useBootstrapPrefix } from '../hooks/useBootstrapPrefix'
import { FormCheckInput, type FormCheckInputProps } from '../Form/FormCheckInput'
import { InputGroupText } from './InputGroupText'
import { InputGroupContext } from './InputGroupContext'
import type { BsPrefixProps } from '../types'

const InputGroupCheckbox = (props: FormCheckInputProps) => (
	<InputGroupText>
		<FormCheckInput type="checkbox" {...props} />
	</InputGroupText>
)

const InputGroupRadio = (props: FormCheckInputProps) => (
	<InputGroupText>
		<FormCheckInput type="radio" {...props} />
	</InputGroupText>
)

export interface InputGroupProps extends BsPrefixProps, React.HTMLAttributes<HTMLElement> {
	size?: 'sm' | 'lg'
	hasValidation?: boolean
	ref?: React.Ref<HTMLElement>
}

export const InputGroupComponent = ({
	ref,
	bsPrefix,
	size,
	hasValidation,
	className,
	// for styled-component
	as: Component = 'div',
	...restProps
}: InputGroupProps) => {
	bsPrefix = useBootstrapPrefix(bsPrefix, 'input-group')

	// 의도적으로 빈 객체입니다. 입력 그룹 아래에 드롭다운이 있는지 감지하는 데 사용됩니다.
	const contextValue = useMemo(() => ({}), [])

	return (
		<InputGroupContext value={contextValue}>
			<Component
				ref={ref}
				{...restProps}
				className={clsx(className, bsPrefix, {
					[`${bsPrefix}-${size}`]: size,
					'has-validation': hasValidation,
				})}
			/>
		</InputGroupContext>
	)
}

export const InputGroup = Object.assign(InputGroupComponent, {
	Text: InputGroupText,
	Radio: InputGroupRadio,
	Checkbox: InputGroupCheckbox,
})
