import clsx from 'clsx'
import { useBootstrapPrefix } from '../hooks/useBootstrapPrefix'
import { AccordionButton } from './AccordionButton'
import type { BsPrefixProps } from '../types'

export interface AccordionHeaderProps extends BsPrefixProps, React.HTMLAttributes<HTMLElement> {
	ref?: React.Ref<HTMLElement>
}

export const AccordionHeader = ({
	as: Component = 'h2',
	'aria-controls': ariaControls,
	bsPrefix,
	className,
	children,
	onClick,
	ref,
	...restProps
}: AccordionHeaderProps) => {
	bsPrefix = useBootstrapPrefix(bsPrefix, 'accordion-header')

	return (
		<Component ref={ref} {...restProps} className={clsx(className, bsPrefix)}>
			<AccordionButton onClick={onClick} aria-controls={ariaControls}>
				{children}
			</AccordionButton>
		</Component>
	)
}
