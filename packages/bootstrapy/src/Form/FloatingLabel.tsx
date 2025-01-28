import clsx from 'clsx'
import { useBootstrapPrefix } from '../hooks/useBootstrapPrefix'
import { FormGroup, type FormGroupProps } from './FormGroup'
import type { BsPrefixProps } from '../types'

export interface FloatingLabelProps extends FormGroupProps, BsPrefixProps {
	controlId?: string
	label: React.ReactNode
}

export const FloatingLabel = ({
	ref,
	bsPrefix,
	className,
	children,
	controlId,
	label,
	...restProps
}: FloatingLabelProps) => {
	bsPrefix = useBootstrapPrefix(bsPrefix, 'form-floating')

	return (
		<FormGroup
			ref={ref}
			className={clsx(className, bsPrefix)}
			controlId={controlId}
			{...restProps}
		>
			{children}
			<label htmlFor={controlId}>{label}</label>
		</FormGroup>
	)
}
