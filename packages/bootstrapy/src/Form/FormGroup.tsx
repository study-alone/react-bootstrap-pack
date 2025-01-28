import { useMemo } from 'react'
import { FormContext } from './FormContext'
import type { AsProps } from '../types'

export interface FormGroupProps extends React.HTMLAttributes<HTMLElement>, AsProps {
	/**
	 * Sets `id` on `<FormControl>` and `htmlFor` on `<FormGroup.Label>`.
	 */
	controlId?: string
	ref?: React.Ref<HTMLElement>
}

export const FormGroup = ({
	controlId,
	// for styled-component
	as: Component = 'div',
	ref,
	...restProps
}: FormGroupProps) => {
	const context = useMemo(() => ({ controlId }), [controlId])

	return (
		<FormContext value={context}>
			<Component {...restProps} ref={ref} />
		</FormContext>
	)
}
