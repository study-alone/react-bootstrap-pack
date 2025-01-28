import { useContext, useEffect, useRef } from 'react'
import clsx from 'clsx'
import { useBootstrapPrefix } from '../hooks/useBootstrapPrefix'
import { Collapse, type CollapseProps } from '../Collapse'
import { NavbarContext } from './NavbarContext'
import type { BsPrefixProps } from '../types'

export interface NavbarCollapseProps
	extends Omit<CollapseProps, 'children' | 'ref' | 'nodeRef'>,
		React.HTMLAttributes<HTMLDivElement>,
		BsPrefixProps {
	ref?: React.RefObject<HTMLDivElement>
}

export const NavbarCollapse = ({ children, bsPrefix, ref, ...props }: NavbarCollapseProps) => {
	bsPrefix = useBootstrapPrefix(bsPrefix, 'navbar-collapse')
	const context = useContext(NavbarContext)
	const nodeRef = useRef<HTMLDivElement>(null)

	// TODO: ref와 nodeRef를 object 수중에서 merge할 수 있는지?

	useEffect(() => {
		if (ref && !nodeRef.current) {
			nodeRef.current = ref.current
		}
	}, [ref])

	return (
		<Collapse in={!!(context && context.expanded)} {...props} nodeRef={nodeRef}>
			{(classNames, innerProps) => (
				<div ref={ref || nodeRef} className={clsx(bsPrefix, classNames)} {...innerProps}>
					{children}
				</div>
			)}
		</Collapse>
	)
}
