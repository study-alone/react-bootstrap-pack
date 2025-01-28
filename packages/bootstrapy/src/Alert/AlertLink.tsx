import clsx from 'clsx'
import { Anchor } from '@repo/restart-ui/Anchor'
import { useBootstrapPrefix } from '../hooks/useBootstrapPrefix'
import type { BsPrefixProps } from '../types'

export interface AlertLinkProps extends BsPrefixProps, React.AnchorHTMLAttributes<HTMLElement> {
	ref?: React.Ref<HTMLElement>
}

export const AlertLink = ({
	className,
	bsPrefix,
	as: Component = Anchor,
	ref,
	...props
}: AlertLinkProps) => {
	bsPrefix = useBootstrapPrefix(bsPrefix, 'alert-link')

	return <Component ref={ref} className={clsx(className, bsPrefix)} {...props} />
}

AlertLink.displayName = 'AlertLink'
