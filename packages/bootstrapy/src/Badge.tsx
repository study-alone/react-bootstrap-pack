import clsx from 'clsx'
import { useBootstrapPrefix } from './hooks/useBootstrapPrefix'
import type { BsPrefixProps, Color, Variant } from './types'

export interface BadgeProps extends BsPrefixProps, React.HTMLAttributes<HTMLElement> {
	bg?: Variant
	pill?: boolean
	text?: Color
	ref?: React.Ref<HTMLElement>
}

export const Badge = ({
	bsPrefix,
	bg = 'primary',
	pill = false,
	text,
	className,
	as: Component = 'span',
	ref,
	...restProps
}: BadgeProps) => {
	const prefix = useBootstrapPrefix(bsPrefix, 'badge')

	return (
		<Component
			ref={ref}
			{...restProps}
			className={clsx(className, prefix, {
				'rounded-pill': pill,
				[`text-${text}`]: !!text,
				[`bg-${bg}`]: bg,
			})}
		/>
	)
}
