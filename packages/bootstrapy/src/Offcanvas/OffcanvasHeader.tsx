import clsx from 'clsx'
import { AbstractModalHeader, type AbstractModalHeaderProps } from '../AbstractModalHeader'
import { useBootstrapPrefix } from '../hooks/useBootstrapPrefix'
import type { BsPrefixOnlyProps } from '../types'

export interface OffcanvasHeaderProps extends AbstractModalHeaderProps, BsPrefixOnlyProps {
	ref?: React.Ref<HTMLDivElement>
}

export const OffcanvasHeader = ({
	bsPrefix,
	className,
	closeLabel = 'Close',
	closeButton = false,
	ref,
	...restProps
}: OffcanvasHeaderProps) => {
	const prefix = useBootstrapPrefix(bsPrefix, 'offcanvas-header')

	return (
		<AbstractModalHeader
			ref={ref}
			{...restProps}
			className={clsx(className, prefix)}
			closeLabel={closeLabel}
			closeButton={closeButton}
		/>
	)
}
