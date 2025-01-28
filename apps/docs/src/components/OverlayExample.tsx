'use client'

import { useState, useRef, useEffect } from 'react'
import { Button, Dropdown, Overlay } from '@repo/bootstrapy'

export function OverlayExample() {
	const [show, setShow] = useState(false)
	const target = useRef(null)
	const overlayRef = useRef<HTMLElement>(null)

	return (
		<div className="bootstrapy" style={{ minHeight: 'auto', backgroundColor: 'transparent' }}>
			<div data-bs-theme="dark">
				<Button variant="danger" ref={target} onClick={() => setShow(!show)}>
					Click me to see
				</Button>
				<Overlay
					ref={(node) => {
						overlayRef.current = node
					}}
					target={target.current}
					show={show}
					placement="right"
				>
					{({
						placement: _placement,
						arrowProps: _arrowProps,
						show: _show,
						popper: _popper,
						hasDoneInitialMeasure: _hasDoneInitialMeasure,
						...props
					}) => (
						<div
							{...props}
							style={{
								position: 'absolute',
								backgroundColor: 'rgba(255, 100, 100, 0.85)',
								padding: '2px 10px',
								color: 'white',
								borderRadius: 3,
								...props.style,
							}}
						>
							Simple tooltip
						</div>
					)}
				</Overlay>
			</div>
		</div>
	)
}
