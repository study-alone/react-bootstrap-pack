import clsx from 'clsx'
import type { BsPrefixOnlyProps, AsProps } from '../types'

export type FeedbackType = 'valid' | 'invalid'

export interface FeedbackProps
	extends AsProps,
		BsPrefixOnlyProps,
		React.HTMLAttributes<HTMLElement> {
	type?: FeedbackType
	tooltip?: boolean
	ref?: React.Ref<HTMLElement>
}

export const Feedback = ({
	as: Component = 'div',
	className,
	type = 'valid',
	tooltip = false,
	ref,
	...restProps
}: FeedbackProps) => {
	return (
		<Component
			{...restProps}
			ref={ref}
			className={clsx(className, `${type}-${tooltip ? 'tooltip' : 'feedback'}`)}
		/>
	)
}
