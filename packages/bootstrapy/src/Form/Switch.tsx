import { FormCheck, type FormCheckProps } from './FormCheck'

type SwitchProps = Omit<FormCheckProps, 'type'>

export const SwitchComponent = ({ ref, ...props }: SwitchProps) => {
	return <FormCheck {...props} ref={ref} type="switch" />
}

export const Switch = Object.assign(SwitchComponent, {
	Input: FormCheck.Input,
	Label: FormCheck.Label,
})
