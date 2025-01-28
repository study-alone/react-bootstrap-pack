import { useContext } from 'react'
import clsx from 'clsx'
import { useBootstrapPrefix } from '../hooks/useBootstrapPrefix'
import { FormContext } from './FormContext'
import type { BsPrefixProps } from '../types'

export interface FormCheckLabelProps
	extends React.LabelHTMLAttributes<HTMLLabelElement>,
		BsPrefixProps {
	ref?: React.Ref<HTMLLabelElement>
}

export const FormCheckLabel = ({
	ref,
	bsPrefix,
	className,
	htmlFor,
	...restProps
}: FormCheckLabelProps) => {
	const { controlId } = useContext(FormContext)

	bsPrefix = useBootstrapPrefix(bsPrefix, 'form-check-label')

	return (
		<label
			{...restProps}
			ref={ref}
			htmlFor={htmlFor || controlId}
			className={clsx(className, bsPrefix)}
		/>
	)
}
