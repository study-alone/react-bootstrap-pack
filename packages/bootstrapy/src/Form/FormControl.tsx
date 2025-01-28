import { useContext } from 'react'
import warning from 'warning'
import clsx from 'clsx'
import { useBootstrapPrefix } from '../hooks/useBootstrapPrefix'
import { FormContext } from './FormContext'
import type { BsPrefixProps } from '../types'

type FormControlElement = HTMLInputElement | HTMLTextAreaElement

export interface FormControlProps
	extends BsPrefixProps,
		Omit<React.InputHTMLAttributes<FormControlElement>, 'size'> {
	htmlSize?: number
	size?: 'sm' | 'lg'
	plaintext?: boolean
	readOnly?: boolean
	disabled?: boolean
	value?: string | string[] | number
	onChange?: React.ChangeEventHandler<FormControlElement>
	type?: string
	isValid?: boolean
	isInvalid?: boolean
	ref?: React.Ref<FormControlElement>
}

export const FormControl = ({
	ref,
	bsPrefix,
	type,
	size,
	htmlSize,
	id,
	className,
	isValid = false,
	isInvalid = false,
	plaintext,
	readOnly,
	// for styled-component
	as: Component = 'input',
	...restProps
}: FormControlProps) => {
	const { controlId } = useContext(FormContext)
	const prefix = useBootstrapPrefix(bsPrefix, 'form-control')

	warning(
		controlId == null || !id,
		'`controlId` is ignored on `<FormControl>` when `id` is specified.',
	)

	return (
		<Component
			{...restProps}
			type={type}
			size={htmlSize}
			ref={ref}
			readOnly={readOnly}
			id={id || controlId}
			className={clsx(className, plaintext ? `${prefix}-plaintext` : prefix, {
				[`${prefix}-${size}`]: size,
				[`${prefix}-color`]: type === 'color',
				'is-valid': isValid,
				'is-invalid': isInvalid,
			})}
		/>
	)
}
