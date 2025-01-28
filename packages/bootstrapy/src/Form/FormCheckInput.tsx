import { useContext } from 'react'
import clsx from 'clsx'
import { useBootstrapPrefix } from '../hooks/useBootstrapPrefix'
import { FormContext } from './FormContext'
import type { BsPrefixProps } from '../types'

type FormCheckInputType = 'checkbox' | 'radio'

export interface FormCheckInputProps
	extends BsPrefixProps,
		React.InputHTMLAttributes<HTMLInputElement> {
	type?: FormCheckInputType
	isValid?: boolean
	isInvalid?: boolean
	ref?: React.Ref<HTMLInputElement>
}

export const FormCheckInput = ({
	ref,
	id,
	bsPrefix,
	className,
	type = 'checkbox',
	isValid = false,
	isInvalid = false,
	as: Component = 'input',
	...restProps
}: FormCheckInputProps) => {
	const { controlId } = useContext(FormContext)
	bsPrefix = useBootstrapPrefix(bsPrefix, 'form-check-input')

	return (
		<Component
			{...restProps}
			ref={ref}
			type={type}
			id={id || controlId}
			className={clsx(className, bsPrefix, {
				'is-valid': isValid,
				'is-invalid': isInvalid,
			})}
		/>
	)
}
