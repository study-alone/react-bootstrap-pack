import clsx from 'clsx'
import { useBootstrapPrefix } from '../hooks/useBootstrapPrefix'
import { AbstractModalHeader } from '../AbstractModalHeader'
import type { BsPrefixOnlyProps } from '../types'
import type { AbstractModalHeaderProps } from '../AbstractModalHeader'

export interface ModalHeaderProps extends AbstractModalHeaderProps, BsPrefixOnlyProps {
	ref?: React.Ref<HTMLDivElement>
}

export const ModalHeader = ({
	bsPrefix,
	className,
	closeLabel = 'Close',
	closeButton = false,
	ref,
	...restProps
}: ModalHeaderProps) => {
	const prefix = useBootstrapPrefix(bsPrefix, 'modal-header')

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
