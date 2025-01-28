import { useMemo, useRef } from 'react'
import { hasClass } from '@repo/dom-helper'
import { useBootstrapPrefix } from '../hooks/useBootstrapPrefix'
import { Tooltip } from '../Tooltip'
import { Popover } from '../Popover'
import type { Offset, Options } from '@repo/restart-ui/usePopper'

// This is meant for internal use.
// This applies a custom offset to the overlay if it's a popover or tooltip.
export function useOverlayOffset(
	customOffset?: Offset,
): [React.RefObject<HTMLElement | null>, Options['modifiers']] {
	const overlayRef = useRef<HTMLDivElement | null>(null)
	const popoverClass = useBootstrapPrefix(undefined, 'popover')
	const tooltipClass = useBootstrapPrefix(undefined, 'tooltip')

	const offset = useMemo(
		() => ({
			name: 'offset',
			options: {
				offset: () => {
					if (customOffset) {
						return customOffset
					}

					if (overlayRef.current) {
						if (hasClass(overlayRef.current, popoverClass)) {
							return Popover.POPPER_OFFSET
						}

						if (hasClass(overlayRef.current, tooltipClass)) {
							return Tooltip.TOOLTIP_OFFSET
						}
					}
					return [0, 0]
				},
			},
		}),
		[customOffset, popoverClass, tooltipClass],
	)

	return [overlayRef, [offset]]
}
