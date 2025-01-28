import clsx from 'clsx'
import { FormGroup } from './FormGroup'
import { FormControl } from './FormControl'
import { FormFloating } from './FormFloating'
import { FormCheck } from './FormCheck'
import { Switch } from './Switch'
import { FormLabel } from './FormLabel'
import { FormText } from './FormText'
import { FormRange } from './FormRange'
import { FormSelect } from './FormSelect'
import { FloatingLabel } from './FloatingLabel'
import type { AsProps } from '../types'

export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement>, AsProps {
	validated?: boolean
	ref?: React.Ref<HTMLFormElement>
}

const FromComponent = ({
	ref,
	className,
	validated,
	// form styled-component
	as: Component = 'form',
	...restProps
}: FormProps) => {
	return (
		<Component
			{...restProps}
			ref={ref}
			className={clsx(className, { 'was-validated': validated })}
		/>
	)
}

export const Form = Object.assign(FromComponent, {
	Group: FormGroup,
	Control: FormControl,
	Floating: FormFloating,
	Check: FormCheck,
	Switch,
	Label: FormLabel,
	Text: FormText,
	Range: FormRange,
	Select: FormSelect,
	FloatingLabel,
})
