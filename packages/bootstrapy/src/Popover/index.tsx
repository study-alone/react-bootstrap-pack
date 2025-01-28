import clsx from 'clsx'
import { useBootstrapPrefix } from '../hooks/useBootstrapPrefix'
import { useIsRTL } from '../hooks/useIsRTL'
import { getInitialPopperStyles } from '../utils/getInitialPopperStyles'
import { getOverlayDirection } from '../utils/getOverlayDirection'
import { PopoverHeader } from './PopoverHeader'
import { PopoverBody } from './PopoverBody'
import type { BsPrefixProps, Placement, PopperRef } from '../types'
import type { OverlayArrowProps } from '@repo/restart-ui/Overlay'

export interface PopoverProps extends React.HTMLAttributes<HTMLDivElement>, BsPrefixProps {
	placement?: Placement
	title?: string
	arrowProps?: Partial<OverlayArrowProps>
	body?: boolean
	popper?: PopperRef
	show?: boolean
	hasDoneInitialMeasure?: boolean
	ref?: React.Ref<HTMLDivElement>
}

const PopoverComponent = ({
	bsPrefix,
	placement = 'right',
	className,
	style,
	children,
	body,
	arrowProps,
	hasDoneInitialMeasure,
	popper,
	show,
	ref,
	...props
}: PopoverProps) => {
	const decoratedBsPrefix = useBootstrapPrefix(bsPrefix, 'popover')
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
			role="tooltip"
			style={computedStyle}
			// eslint-disable-next-line react/no-unknown-property
			x-placement={primaryPlacement}
			className={clsx(
				className,
				decoratedBsPrefix,
				primaryPlacement && `bs-popover-${bsDirection}`,
			)}
			{...props}
		>
			<div className="popover-arrow" {...arrowProps} />
			{body ? <PopoverBody>{children}</PopoverBody> : children}
		</div>
	)
}

export const Popover = Object.assign(PopoverComponent, {
	Header: PopoverHeader,
	Body: PopoverBody,

	// Default popover offset.
	// https://github.com/twbs/bootstrap/blob/5c32767e0e0dbac2d934bcdee03719a65d3f1187/js/src/popover.js#L28
	POPPER_OFFSET: [0, 8] as const,
})
