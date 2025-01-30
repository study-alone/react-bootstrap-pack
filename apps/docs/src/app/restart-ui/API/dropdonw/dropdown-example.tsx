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

const DropdownMenuItem = ({ title }: { title: string }) => {
	return (
		<Dropdown.Item className="text-left hover:bg-primary-100 px-6 py-2 focus:ring-2 focus:outline-none">
			{title}
		</Dropdown.Item>
	)
}

const DropdownMenu = ({ role }: { role: React.AriaRole }) => {
	const [props, { toggle, show, popper }] = useDropdownMenu<HTMLDivElement>({
		flip: true,
		offset: [0, 8],
	})

	useLayoutEffect(() => {
		if (show) {
			popper?.update()
		}
	}, [show])

	return (
		<div
			{...props}
			role={role}
			className={clsx(
				show ? 'flex' : 'hidden',
				'w-48 py-2 flex-col shadow-lg border-gray-200 border bg-white z-10 rounded',
			)}
		>
			{['Item 1', 'Item 2'].map((item) => (
				<DropdownMenuItem key={item} title={item} />
			))}
		</div>
	)
}

const DropdownToggle = ({ children }: { children: React.ReactNode }) => {
	const [props, { show, toggle }] = useDropdownToggle<HTMLButtonElement>()

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
		<div className="flex justify-center space-x-5 text-purple-500">
			<DropdownButton
				show={show}
				onToggle={(nextShow) => setShow(nextShow)}
				title={`${show ? 'Close' : 'Open'} Dropdown`}
				role="menu"
			/>
		</div>
	)
}
