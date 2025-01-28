import clsx from 'clsx'
import { useBootstrapPrefix } from 'src/hooks/useBootstrapPrefix'
import type { BsPrefixProps } from 'src/types'

export interface ButtonToolbarProps extends BsPrefixProps, React.HTMLAttributes<HTMLElement> {
	ref?: React.Ref<HTMLDivElement>
}

export const ButtonToolbar = ({
	bsPrefix,
	className,
	role = 'toolbar',
	ref,
	...restProps
}: ButtonToolbarProps) => {
	const prefix = useBootstrapPrefix(bsPrefix, 'btn-toolbar')

	return <div {...restProps} ref={ref} className={clsx(className, prefix)} role={role} />
}
