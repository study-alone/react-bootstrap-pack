import clsx from 'clsx'
import { useBootstrapPrefix } from '../hooks/useBootstrapPrefix'
import { useBootstrapBreakpoints } from '../hooks/useBootstrapBreakpoints'
import { useBootstrapMinBreakpoint } from '../hooks/useBootstrapMinBreakpoint'
import { createUtilityClasses, type ResponsiveUtilityValue } from '../utils/createUtilityClasses'
import type { BsPrefixProps, GapValue } from '../types'

type StackDirection = 'horizontal' | 'vertical'

export interface StackProps extends BsPrefixProps, React.HTMLAttributes<HTMLElement> {
	direction?: StackDirection
	gap?: ResponsiveUtilityValue<GapValue>
	ref?: React.Ref<HTMLElement>
}

export const Stack = ({
	as: Component = 'div',
	bsPrefix,
	className,
	direction,
	gap,
	ref,
	...restProps
}: StackProps) => {
	bsPrefix = useBootstrapPrefix(bsPrefix, direction === 'horizontal' ? 'hstack' : 'vstack')
	const breakpoints = useBootstrapBreakpoints()
	const minBreakpoint = useBootstrapMinBreakpoint()

	return (
		<Component
			{...restProps}
			ref={ref}
			className={clsx(
				className,
				bsPrefix,
				...createUtilityClasses({ gap }, breakpoints, minBreakpoint),
			)}
		/>
	)
}
