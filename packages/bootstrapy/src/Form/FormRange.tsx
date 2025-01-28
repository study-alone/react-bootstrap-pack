import clsx from 'clsx'
import { useContext } from 'react'
import { useBootstrapPrefix } from '../hooks/useBootstrapPrefix'
import { FormContext } from './FormContext'
import type { BsPrefixOnlyProps } from '../types'

export interface FormRangeProps
	extends BsPrefixOnlyProps,
		Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
	ref?: React.Ref<HTMLInputElement>
}

export const FormRange = ({ ref, bsPrefix, className, id, ...restProps }: FormRangeProps) => {
	const { controlId } = useContext(FormContext)
	bsPrefix = useBootstrapPrefix(bsPrefix, 'form-range')

	return (
		<input
			{...restProps}
			type="range"
			ref={ref}
			className={clsx(className, bsPrefix)}
			id={id || controlId}
		/>
	)
}
