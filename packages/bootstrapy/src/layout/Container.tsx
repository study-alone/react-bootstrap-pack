import clsx from 'clsx'
import { useBootstrapPrefix } from '../hooks/useBootstrapPrefix'
import type { BsPrefixProps } from '../types'

export interface ContainerProps extends BsPrefixProps, React.HTMLAttributes<HTMLElement> {
	fluid?: boolean | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
	ref?: React.Ref<HTMLElement>
}

export const Container = ({
	bsPrefix,
	fluid = false,
	// Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
	as: Component = 'div',
	className,
	ref,
	...restProps
}: ContainerProps) => {
	const prefix = useBootstrapPrefix(bsPrefix, 'container')
	const suffix = typeof fluid === 'string' ? `-${fluid}` : '-fluid'

	return (
		<Component
			ref={ref}
			{...restProps}
			className={clsx(className, fluid ? `${prefix}${suffix}` : prefix)}
		/>
	)
}
