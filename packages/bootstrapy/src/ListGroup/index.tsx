import { useUncontrolled } from 'uncontrollable'
import clsx from 'clsx'
import warning from 'warning'
import { Nav as BaseNav } from '@repo/restart-ui/Nav'
import { useBootstrapPrefix } from '../hooks/useBootstrapPrefix'
import { ListGroupItem } from './ListGroupItem'
import type { BsPrefixProps } from '../types'
import type { EventKey } from '@repo/restart-ui'
import type { NavProps as BaseNavProps } from '@repo/restart-ui/Nav'

export interface ListGroupProps extends BsPrefixProps, BaseNavProps {
	variant?: 'flush'
	horizontal?: boolean | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
	defaultActiveKey?: EventKey
	numbered?: boolean
	ref?: React.Ref<HTMLElement>
}

const ListGroupComponent = ({ ref, ...props }: ListGroupProps) => {
	const {
		className,
		bsPrefix: initialBsPrefix,
		variant,
		horizontal,
		numbered,
		as = 'div',
		...controlledProps
	} = useUncontrolled(props, {
		activeKey: 'onSelect',
	})

	const bsPrefix = useBootstrapPrefix(initialBsPrefix, 'list-group')

	let horizontalVariant: string | undefined
	if (horizontal) {
		horizontalVariant = horizontal === true ? 'horizontal' : `horizontal-${horizontal}`
	}

	warning(
		!(horizontal && variant === 'flush'),
		'`variant="flush"` and `horizontal` should not be used together.',
	)

	return (
		<BaseNav
			ref={ref}
			{...controlledProps}
			as={as}
			className={clsx(className, bsPrefix, {
				[`${bsPrefix}-${variant}`]: variant,
				[`${bsPrefix}-${horizontalVariant}`]: horizontalVariant,
				[`${bsPrefix}-numbered`]: numbered,
			})}
		/>
	)
}

export const ListGroup = Object.assign(ListGroupComponent, {
	Item: ListGroupItem,
})
