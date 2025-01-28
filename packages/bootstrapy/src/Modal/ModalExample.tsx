import { useRef, useState } from 'react'
import { Button } from '../Button'
import { Modal } from './index'

export const ModalExample = () => {
	const [liveDemoShow, setLiveDemoShow] = useState(false)
	const handleLiveDemoShow = () => setLiveDemoShow(true)
	const handleLiveDemoClose = () => setLiveDemoShow(false)

	const liveDemoRef = useRef<HTMLElement>(null)

	return (
		<>
			<section>
				<h3>Static Markup</h3>
				<div className="modal show" style={{ display: 'block', position: 'initial' }}>
					<Modal.Dialog>
						<Modal.Header closeButton>
							<Modal.Title>Modal title</Modal.Title>
						</Modal.Header>

						<Modal.Body>
							<p>Modal body text goes here.</p>
						</Modal.Body>

						<Modal.Footer>
							<Button variant="secondary">Close</Button>
							<Button variant="primary">Save changes</Button>
						</Modal.Footer>
					</Modal.Dialog>
				</div>
			</section>
			<section>
				<h3>Live Demo</h3>
				<div>
					<Button variant="primary" onClick={handleLiveDemoShow}>
						Launch demo modal
					</Button>

					<Modal nodeRef={liveDemoRef} show={liveDemoShow} onHide={handleLiveDemoClose}>
						<Modal.Header closeButton>
							<Modal.Title>Modal heading</Modal.Title>
						</Modal.Header>
						<Modal.Body>Woohoo, you are reading this text in a modal!</Modal.Body>
						<Modal.Footer>
							<Button variant="secondary" onClick={handleLiveDemoClose}>
								Close
							</Button>
							<Button variant="primary" onClick={handleLiveDemoClose}>
								Save Changes
							</Button>
						</Modal.Footer>
					</Modal>
				</div>
			</section>
		</>
	)
}
