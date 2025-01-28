import { useMemo } from 'react'
import clsx from 'clsx'
import { useBootstrapPrefix } from '../hooks/useBootstrapPrefix'
import { CardHeaderContext } from '../Card/CardHeaderContext'
import type { BsPrefixProps } from '../types'

export interface CardHeaderProps extends BsPrefixProps, React.HTMLAttributes<HTMLElement> {
	ref?: React.Ref<HTMLElement>
}

export const CardHeader = ({
	bsPrefix,
	className,
	as: Component = 'div',
	ref,
	...restProps
}: CardHeaderProps) => {
	const prefix = useBootstrapPrefix(bsPrefix, 'card-header')
	const contextValue = useMemo(
		() => ({
			cardHeaderBsPrefix: prefix,
		}),
		[prefix],
	)

	return (
		<CardHeaderContext.Provider value={contextValue}>
			<Component ref={ref} {...restProps} className={clsx(className, prefix)} />
		</CardHeaderContext.Provider>
	)
}
