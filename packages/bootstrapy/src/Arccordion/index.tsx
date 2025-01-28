import clsx from 'clsx'
import { useMemo } from 'react'
import { useUncontrolled } from 'uncontrollable'
import { useBootstrapPrefix } from '../hooks/useBootstrapPrefix'
import { AccordionBody } from './AccordionBody'
import { AccordionButton } from './AccordionButton'
import { AccordionCollapse } from './AccrodionCollapse'
import { AccordionContext } from './AccordionContext'
import { AccordionHeader } from './AccordionHeader'
import { AccordionItem } from './AccordionItem'
import type { BsPrefixProps } from '../types'
import type {
	AccordionSelectCallback,
	AccordionEventKey,
	AccordionContextValue,
} from './AccordionContext'

export interface AccordionProps
	extends Omit<React.HTMLAttributes<HTMLElement>, 'onSelect'>,
		BsPrefixProps {
	activeKey?: AccordionEventKey
	defaultActiveKey?: AccordionEventKey
	onSelect?: AccordionSelectCallback
	flush?: boolean
	alwaysOpen?: boolean
	ref?: React.Ref<HTMLElement>
}

const AccordionComponent = ({ ref, ...props }: AccordionProps) => {
	const {
		as: Component = 'div',
		activeKey,
		bsPrefix,
		className,
		onSelect,
		flush,
		alwaysOpen,
		...controledProps
	} = useUncontrolled(props, {
		activeKey: 'onSelect',
	})

	const prefix = useBootstrapPrefix(bsPrefix, 'accordion')
	const contextValue = useMemo<AccordionContextValue>(
		() => ({
			activeEventKey: activeKey,
			onSelect,
			alwaysOpen,
		}),
		[activeKey, alwaysOpen, onSelect],
	)

	return (
		<AccordionContext.Provider value={contextValue}>
			<Component
				ref={ref}
				{...controledProps}
				className={clsx(className, prefix, {
					[`${prefix}-flush`]: flush,
				})}
			/>
		</AccordionContext.Provider>
	)
}

export const Accordion = Object.assign(AccordionComponent, {
	Body: AccordionBody,
	Button: AccordionButton,
	Collapse: AccordionCollapse,
	Header: AccordionHeader,
	Item: AccordionItem,
})
