import { useContext } from 'react'
import { useEventCallback } from '@repo/restart-hooks'
import { Offcanvas, type OffcanvasProps } from '../Offcanvas'
import { NavbarContext } from './NavbarContext'

export type NavbarOffcanvasProps = Omit<OffcanvasProps, 'show'> & {
	ref?: React.Ref<HTMLDivElement>
}

export const NavbarOffcanvas = ({ onHide = () => {}, ref, ...restProps }: NavbarOffcanvasProps) => {
	const context = useContext(NavbarContext)

	const handleHide = useEventCallback(() => {
		context?.onToggle()
		onHide()
	})

	return (
		<Offcanvas
			ref={ref}
			show={!!context?.expanded}
			{...restProps}
			renderStaticNode
			onHide={handleHide}
		/>
	)
}
