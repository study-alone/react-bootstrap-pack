import clsx from 'clsx'
import { useMemo } from 'react'
import { useBootstrapPrefix } from '../hooks/useBootstrapPrefix'
import { AccordionItemContext } from './AccordionItemContext'
import type { AccordionItemContextValue } from './AccordionItemContext'
import type { BsPrefixProps } from '../types'

export interface AccordionItemProps extends BsPrefixProps, React.HTMLAttributes<HTMLElement> {
	eventKey: string
	ref?: React.Ref<HTMLElement>
}

export const AccordionItem = ({
	as: Component = 'div',
	bsPrefix,
	className,
	eventKey,
	ref,
	...restProps
}: AccordionItemProps) => {
	bsPrefix = useBootstrapPrefix(bsPrefix, 'accordion-item')
	const contextValue = useMemo<AccordionItemContextValue>(() => ({ eventKey }), [eventKey])

	return (
		<AccordionItemContext.Provider value={contextValue}>
			<Component ref={ref} {...restProps} className={clsx(className, bsPrefix)} />
		</AccordionItemContext.Provider>
	)
}
