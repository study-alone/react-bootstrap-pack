import { useContext, useMemo } from 'react'
import clsx from 'clsx'
import { hasChildOfType } from '../utils/elementChildren'
import { useBootstrapPrefix } from '../hooks/useBootstrapPrefix'
import { FormContext } from './FormContext'
import { FormCheckLabel } from './FormCheckLabel'
import { FormCheckInput } from './FormCheckInput'
import { Feedback, type FeedbackType } from './Feedback'
import type { BsPrefixProps } from '../types'

export type FormCheckType = 'checkbox' | 'radio' | 'switch'

export interface FormCheckProps extends BsPrefixProps, React.InputHTMLAttributes<HTMLInputElement> {
	inline?: boolean
	reverse?: boolean
	disabled?: boolean
	label?: React.ReactNode
	type?: FormCheckType
	isValid?: boolean
	isInvalid?: boolean
	feedbackTooltip?: boolean
	feedback?: React.ReactNode
	feedbackType?: FeedbackType
	bsSwitchPrefix?: string
	ref?: React.Ref<HTMLInputElement>
}

export const FormCheckComponent = ({
	ref,
	id,
	bsPrefix,
	bsSwitchPrefix,
	inline = false,
	reverse = false,
	disabled = false,
	isValid = false,
	isInvalid = false,
	feedbackTooltip = false,
	feedback,
	feedbackType,
	className,
	style,
	title = '',
	type = 'checkbox',
	label,
	children,
	// Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
	as = 'input',
	...restProps
}: FormCheckProps) => {
	bsPrefix = useBootstrapPrefix(bsPrefix, 'form-check')
	bsSwitchPrefix = useBootstrapPrefix(bsSwitchPrefix, 'form-switch')

	const { controlId } = useContext(FormContext)
	const innerFormContext = useMemo(() => ({ controlId: id || controlId }), [controlId, id])

	const hasLabel =
		(!children && label != null && label !== false) || hasChildOfType(children, FormCheckLabel)

	const input = (
		<FormCheckInput
			{...restProps}
			type={type === 'switch' ? 'checkbox' : type}
			ref={ref}
			isValid={isValid}
			isInvalid={isInvalid}
			disabled={disabled}
			as={as}
		/>
	)

	return (
		<FormContext value={innerFormContext}>
			<div
				style={style}
				className={clsx(className, {
					[bsPrefix]: hasLabel,
					[`${bsPrefix}-inline`]: inline,
					[`${bsPrefix}-reverse`]: reverse,
					[bsSwitchPrefix]: type === 'switch',
				})}
			>
				{children || (
					<>
						{input}
						{hasLabel && <FormCheckLabel title={title}>{label}</FormCheckLabel>}
						{feedback && (
							<Feedback type={feedbackType} tooltip={feedbackTooltip}>
								{feedback}
							</Feedback>
						)}
					</>
				)}
			</div>
		</FormContext>
	)
}

export const FormCheck = Object.assign(FormCheckComponent, {
	Input: FormCheckInput,
	Label: FormCheckLabel,
})
