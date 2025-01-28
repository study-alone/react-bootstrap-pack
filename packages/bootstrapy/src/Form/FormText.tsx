import clsx from 'clsx'
import { useBootstrapPrefix } from '../hooks/useBootstrapPrefix'
import type { BsPrefixProps } from '../types'

export interface FormTextProps extends BsPrefixProps, React.HTMLAttributes<HTMLElement> {
	muted?: boolean
	ref?: React.Ref<HTMLElement>
}

export const FormText = ({
	bsPrefix,
	className,
	as: Component = 'small',
	muted,
	ref,
	...restProps
}: FormTextProps) => {
	bsPrefix = useBootstrapPrefix(bsPrefix, 'form-text')

	return (
		<Component
			{...restProps}
			ref={ref}
			className={clsx(className, bsPrefix, { 'text-muted': muted })}
		/>
	)
}
