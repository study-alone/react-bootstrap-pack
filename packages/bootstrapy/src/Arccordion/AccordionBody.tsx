import clsx from 'clsx'
import { useContext, useRef } from 'react'
import { useBootstrapPrefix } from '../hooks/useBootstrapPrefix'
import { AccordionCollapse } from './AccrodionCollapse'
import { AccordionItemContext } from './AccordionItemContext'
import type { BsPrefixProps } from '../types'
import type { TransitionCallbacks } from '@repo/restart-ui'

export interface AccordionBodyProps
	extends BsPrefixProps,
		TransitionCallbacks,
		React.HTMLAttributes<HTMLElement> {
	ref?: React.RefObject<HTMLElement | null>
}

export const AccordionBody = ({
	as: Component = 'div',
	bsPrefix,
	className,
	onEnter,
	onEntering,
	onEntered,
	onExit,
	onExiting,
	onExited,
	children,
	ref,
	...restProps
}: AccordionBodyProps) => {
	bsPrefix = useBootstrapPrefix(bsPrefix, 'accordion-body')
	const { eventKey } = useContext(AccordionItemContext)
	const nodeRef = useRef<HTMLElement>(ref?.current || null)

	return (
		<AccordionCollapse
			nodeRef={nodeRef}
			eventKey={eventKey}
			onEnter={onEnter}
			onEntering={onEntering}
			onEntered={onEntered}
			onExit={onExit}
			onExiting={onExiting}
			onExited={onExited}
		>
			<Component ref={ref} {...restProps} className={clsx(className, bsPrefix)}>
				{children}
			</Component>
		</AccordionCollapse>
	)
}
