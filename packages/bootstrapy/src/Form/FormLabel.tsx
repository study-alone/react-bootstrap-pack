import clsx from 'clsx'
import { useContext } from 'react'
import warning from 'warning'
import { useBootstrapPrefix } from '../hooks/useBootstrapPrefix'
import { Col, type ColProps } from '../layout/Col'
import { FormContext } from './FormContext'
import type { BsPrefixProps } from '../types'

interface FormLabelBaseProps extends BsPrefixProps, React.HTMLAttributes<HTMLElement> {
	htmlFor?: string
	visuallyHidden?: boolean
	ref?: React.Ref<HTMLElement>
}

export interface FormLabelOwnProps extends FormLabelBaseProps {
	column?: false
}

export interface FormLabelWithColProps extends FormLabelBaseProps, ColProps {
	column: true | 'sm' | 'lg'
}

export type FormLabelProps = FormLabelWithColProps | FormLabelOwnProps

export const FormLabel = ({
	// for styled-component
	as: Component = 'label',
	bsPrefix,
	column = false,
	visuallyHidden = false,
	className,
	htmlFor,
	ref,
	...restProps
}: FormLabelProps) => {
	const { controlId } = useContext(FormContext)
	bsPrefix = useBootstrapPrefix(bsPrefix, 'form-label')

	let columnClass = 'col-form-label'
	if (typeof column === 'string') {
		columnClass = `${columnClass} ${columnClass}-${column}`
	}

	const classes = clsx(className, bsPrefix, {
		'visually-hidden': visuallyHidden,
		[columnClass]: column,
	})

	warning(
		controlId == null || !htmlFor,
		'`controlId` is ignored on `<FormLabel>` when `htmlFor` is specified.',
	)

	htmlFor = htmlFor || controlId

	if (column) {
		return <Col ref={ref} as="label" className={classes} htmlFor={htmlFor} {...restProps} />
	}

	return <Component ref={ref} className={classes} htmlFor={htmlFor} {...restProps} />
}
