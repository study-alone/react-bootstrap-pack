import clsx from 'clsx'
import { useBootstrapPrefix } from './hooks/useBootstrapPrefix'
import { useIsRTL } from './hooks/useIsRTL'
import { getOverlayDirection } from './utils/getOverlayDirection'
import { getInitialPopperStyles } from './utils/getInitialPopperStyles'
import type { BsPrefixProps, Placement, PopperRef } from './types'
import type { OverlayArrowProps } from '@repo/restart-ui/Overlay'

export interface TooltipProps extends React.HTMLAttributes<HTMLDivElement>, BsPrefixProps {
	placement?: Placement
	arrowProps?: Partial<OverlayArrowProps>
	show?: boolean
	popper?: PopperRef
	hasDoneInitialMeasure?: boolean
	ref?: React.Ref<HTMLDivElement>
}

const TooltipComponent = ({
	bsPrefix,
	placement = 'right',
	className,
	style,
	children,
	arrowProps,
	hasDoneInitialMeasure,
	popper,
	show,
	ref,
	...props
}: TooltipProps) => {
	bsPrefix = useBootstrapPrefix(bsPrefix, 'tooltip')
	const isRTL = useIsRTL()

	const [primaryPlacement] = placement?.split('-') || []
	const bsDirection = getOverlayDirection(primaryPlacement, isRTL)

	let computedStyle = style
	if (show && !hasDoneInitialMeasure) {
		computedStyle = {
			...style,
			...getInitialPopperStyles(popper?.strategy),
		}
	}

	return (
		<div
			ref={ref}
			style={computedStyle}
			role="tooltip"
			// eslint-disable-next-line react/no-unknown-property
			x-placement={primaryPlacement}
			className={clsx(className, bsPrefix, `bs-tooltip-${bsDirection}`)}
			{...props}
		>
			<div className="tooltip-arrow" {...arrowProps} />
			<div className={`${bsPrefix}-inner`}>{children}</div>
		</div>
	)
}

export const Tooltip = Object.assign(TooltipComponent, {
	// Default tooltip offset.
	// https://github.com/twbs/bootstrap/blob/beca2a6c7f6bc88b6449339fc76edcda832c59e5/js/src/tooltip.js#L65
	TOOLTIP_OFFSET: [0, 6],
})
