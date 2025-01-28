import clsx from 'clsx'
import { useBootstrapPrefix } from '../hooks/useBootstrapPrefix'
import { useBootstrapBreakpoints } from '../hooks/useBootstrapBreakpoints'
import { useBootstrapMinBreakpoint } from '../hooks/useBootstrapMinBreakpoint'
import type { BsPrefixProps } from '../types'

type RowColWidth =
	| number
	| '1'
	| '2'
	| '3'
	| '4'
	| '5'
	| '6'
	| '7'
	| '8'
	| '9'
	| '10'
	| '11'
	| '12'
	| 'auto'
type RowColumns = RowColWidth | { cols?: RowColWidth }

export interface RowProps extends BsPrefixProps, React.HTMLAttributes<HTMLElement> {
	xs?: RowColumns
	sm?: RowColumns
	md?: RowColumns
	lg?: RowColumns
	xl?: RowColumns
	xxl?: RowColumns
	ref?: React.Ref<HTMLDivElement>
	// [key: string]: any
}

export const Row = ({
	bsPrefix,
	className,
	// Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
	as: Component = 'div',
	ref,
	...props
}: RowProps) => {
	const decoratedBsPrefix = useBootstrapPrefix(bsPrefix, 'row')
	const breakpoints = useBootstrapBreakpoints()
	const minBreakpoint = useBootstrapMinBreakpoint()

	const sizePrefix = `${decoratedBsPrefix}-cols`
	const classes: string[] = []

	breakpoints.forEach((brkPoint) => {
		const propValue = props[brkPoint]
		delete props[brkPoint]

		let cols
		if (propValue != null && typeof propValue === 'object') {
			;({ cols } = propValue)
		} else {
			cols = propValue
		}

		const infix = brkPoint !== minBreakpoint ? `-${brkPoint}` : ''

		if (cols != null) classes.push(`${sizePrefix}${infix}-${cols}`)
	})

	return (
		<Component
			ref={ref}
			{...props}
			className={clsx(className, decoratedBsPrefix, ...classes)}
		/>
	)
}
