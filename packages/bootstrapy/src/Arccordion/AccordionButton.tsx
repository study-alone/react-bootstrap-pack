import clsx from 'clsx'
import { useContext } from 'react'
import { useBootstrapPrefix } from '../hooks/useBootstrapPrefix'
import { AccordionContext, isAccordionItemSelected } from './AccordionContext'
import { AccordionItemContext } from './AccordionItemContext'
import { useAccordionButton } from './useAccordionButton'
import type { BsPrefixProps } from '../types'

export interface AccordionButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		BsPrefixProps {
	ref?: React.Ref<HTMLButtonElement>
}

export const AccordionButton = ({
	as: Component = 'button',
	bsPrefix,
	className,
	onClick,
	ref,
	...restProps
}: AccordionButtonProps) => {
	bsPrefix = useBootstrapPrefix(bsPrefix, 'accordion-button')
	const { eventKey } = useContext(AccordionItemContext)
	const accordionOnClick = useAccordionButton(eventKey, onClick)
	const { activeEventKey } = useContext(AccordionContext)

	if (Component === 'button') {
		restProps.type = 'button'
	}

	return (
		<Component
			ref={ref}
			onClick={accordionOnClick}
			{...restProps}
			aria-expanded={
				Array.isArray(activeEventKey)
					? activeEventKey.includes(eventKey)
					: eventKey === activeEventKey
			}
			className={clsx(className, bsPrefix, {
				collapsed: !isAccordionItemSelected(activeEventKey, eventKey),
			})}
		/>
	)
}
