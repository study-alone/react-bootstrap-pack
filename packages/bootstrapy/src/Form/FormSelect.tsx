import { useContext } from 'react'
import clsx from 'clsx'
import { useBootstrapPrefix } from '../hooks/useBootstrapPrefix'
import { FormContext } from './FormContext'
import type { BsPrefixOnlyProps } from '../types'

export interface FormSelectProps
	extends BsPrefixOnlyProps,
		Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
	htmlSize?: number
	size?: 'sm' | 'lg'
	isValid?: boolean
	isInvalid?: boolean
	ref?: React.Ref<HTMLSelectElement>
}

export const FormSelect = ({
	ref,
	bsPrefix,
	size,
	htmlSize,
	className,
	isValid = false,
	isInvalid = false,
	id,
	...restProps
}: FormSelectProps) => {
	const { controlId } = useContext(FormContext)
	bsPrefix = useBootstrapPrefix(bsPrefix, 'form-select')

	return (
		<select
			{...restProps}
			size={htmlSize}
			ref={ref}
			className={clsx(className, bsPrefix, {
				[`${bsPrefix}-${size}`]: size,
				'is-valid': isValid,
				'is-invalid': isInvalid,
			})}
			id={id || controlId}
		/>
	)
}
