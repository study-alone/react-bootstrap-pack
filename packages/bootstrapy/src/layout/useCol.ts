import clsx from 'clsx'
import { useBootstrapBreakpoints } from '../hooks/useBootstrapBreakpoints'
import { useBootstrapMinBreakpoint } from '../hooks/useBootstrapMinBreakpoint'
import { useBootstrapPrefix } from '../hooks/useBootstrapPrefix'
import type { ColOrder, ColProps, ColSize, NumberAttr } from './types'

interface UseColMetadata {
	as?: React.ElementType
	bsPrefix: string
	spans: string[]
}

type RestProps = Omit<ColProps, keyof UseColMetadata>

export function useCol({
	as,
	bsPrefix,
	className,
	...props
}: ColProps): [RestProps, UseColMetadata] {
	bsPrefix = useBootstrapPrefix(bsPrefix, 'col')
	const breakpoints = useBootstrapBreakpoints()
	const minBreakpoint = useBootstrapMinBreakpoint()

	const spans: string[] = []
	const classes: string[] = []

	breakpoints.forEach((brkPoint) => {
		const propValue = props[brkPoint]
		delete props[brkPoint]

		let span: ColSize | undefined
		let offset: NumberAttr | undefined
		let order: ColOrder | undefined

		if (typeof propValue === 'object' && propValue != null) {
			;({ span, offset, order } = propValue)
		} else {
			span = propValue as ColSize
		}

		const infix = brkPoint !== minBreakpoint ? `-${brkPoint}` : ''

		if (span) {
			spans.push(span === true ? `${bsPrefix}${infix}` : `${bsPrefix}${infix}-${span}`)
		}

		if (order != null) {
			classes.push(`order${infix}-${order}`)
		}

		if (offset != null) {
			classes.push(`offset${infix}-${offset}`)
		}
	})

	return [
		{ ...props, className: clsx(className, ...spans, ...classes) },
		{
			as,
			bsPrefix,
			spans,
		},
	]
}
