'use client'
import { useLayoutEffect, useState } from 'react'
import {
	useDropdownToggle,
	useDropdownMenu,
	Dropdown,
	type DropdownProps,
} from '@repo/restart-ui/Dropdown'
import clsx from 'clsx'
import { Button } from '@/components/restart-ui-example/Button'

const DropdownMenu = ({ role }: { role: React.AriaRole }) => {
	const [{ ref, ...props }, { toggle, show, popper }] = useDropdownMenu<HTMLDivElement>({
		flip: true,
		offset: [0, 8],
	})

	useLayoutEffect(() => {
		if (show) popper?.update()
	}, [show])

	return (
		<div
			ref={ref}
			{...props}
			role={role}
			className={clsx(
				show ? 'flex' : 'hidden',
				'w-48 py-2 flex-col shadow-lg border-gray-200 border bg-white z-10 rounded',
			)}
		>
			<Dropdown.Item className="text-left hover:bg-primary-100 px-6 py-2 focus:ring-2 focus:outline-none">
				Item 1
			</Dropdown.Item>
			<Dropdown.Item className="text-left hover:bg-primary-100 px-6 py-2 focus:ring-2 focus:outline-none">
				Item 2
			</Dropdown.Item>
		</div>
	)
}

const DropdownToggle = ({ children }: { children: React.ReactNode }) => {
	const [{ ref, ...props }, { show, toggle }] = useDropdownToggle<HTMLButtonElement>()

	return (
		<Button {...props} className="caret">
			{children}
		</Button>
	)
}

interface DropdownButtonProps {
	show?: boolean
	onToggle: DropdownProps['onToggle']
	title?: string
	role: React.AriaRole
}

const DropdownButton = ({ show, onToggle, title, role }: DropdownButtonProps) => (
	<Dropdown show={show} onToggle={onToggle}>
		<span>
			<DropdownToggle>{title}</DropdownToggle>
			<DropdownMenu role={role} />
		</span>
	</Dropdown>
)

export const DropdownExample = () => {
	const [show, setShow] = useState(false)

	return (
		<div className="flex justify-center space-x-5">
			<DropdownButton
				show={show}
				onToggle={(nextShow) => setShow(nextShow)}
				title={`${show ? 'Close' : 'Open'} Dropdown`}
				role="menu"
			/>
		</div>
	)
}
