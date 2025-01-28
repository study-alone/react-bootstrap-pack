import clsx from 'clsx'
import { useContext } from 'react'
import { useBootstrapPrefix } from '../hooks/useBootstrapPrefix'
import { Collapse, type CollapseProps } from '../Collapse'
import { AccordionContext, isAccordionItemSelected } from './AccordionContext'
import type { BsPrefixProps } from '../types'

export interface AccordionCollapseProps extends BsPrefixProps, Omit<CollapseProps, 'children'> {
	children: React.ReactElement
	eventKey: string
	ref?: React.Ref<HTMLElement>
}

export const AccordionCollapse = ({
	as: Component = 'div',
	bsPrefix,
	children,
	className,
	eventKey,
	ref,
	...restProps
}: AccordionCollapseProps) => {
	const { activeEventKey } = useContext(AccordionContext)
	bsPrefix = useBootstrapPrefix(bsPrefix, 'accordion-collapse')

	const renderChildren = (classNames: string, innerProps?: Record<string, unknown>) => (
		<Component ref={ref} className={classNames} {...innerProps}>
			{children}
		</Component>
	)

	return (
		<Collapse
			in={isAccordionItemSelected(activeEventKey, eventKey)}
			{...restProps}
			className={clsx(className, bsPrefix)}
		>
			{(classNames, innerProps) => renderChildren(classNames, innerProps)}
		</Collapse>
	)
}
