export function getOverlayDirection(placement: string | undefined, isRTL?: boolean) {
	let bsDirection = placement
	if (placement === 'left') {
		bsDirection = isRTL ? 'end' : 'start'
	} else if (placement === 'right') {
		bsDirection = isRTL ? 'start' : 'end'
	}
	return bsDirection
}
