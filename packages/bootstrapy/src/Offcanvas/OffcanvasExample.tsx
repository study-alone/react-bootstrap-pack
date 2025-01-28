import { useState } from 'react'
import { Button } from '../Button'
import { Offcanvas, type OffcanvasPlacement } from './'

interface OffcanvasExampleBasicProps {
	placement?: OffcanvasPlacement
	name?: string
}

const OffcanvasExampleBasic = ({
	placement = 'start',
	name = placement,
}: OffcanvasExampleBasicProps) => {
	const [show, setShow] = useState(false)

	const handleClose = () => setShow(false)
	const handleShow = () => setShow(true)

	return (
		<>
			<Button variant="primary" onClick={handleShow}>
				{name}
			</Button>

			<Offcanvas show={show} onHide={handleClose} placement={placement}>
				<Offcanvas.Header closeButton>
					<Offcanvas.Title>Offcanvas</Offcanvas.Title>
				</Offcanvas.Header>
				<Offcanvas.Body>
					Some text as placeholder. In real life you can have the elements you have
					chosen. Like, text, images, lists, etc.
				</Offcanvas.Body>
			</Offcanvas>
		</>
	)
}

export const OffcanvasExample = () => {
	return (
		<>
			<OffcanvasExampleBasic name="launch" />
			<div>
				{(['start', 'end', 'top', 'bottom'] as const).map((placement, idx) => (
					<OffcanvasExampleBasic key={idx} placement={placement} name={placement} />
				))}
			</div>
		</>
	)
}
