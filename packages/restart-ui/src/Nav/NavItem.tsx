import { Button } from '../Button'
import { makeEventKey } from '../SelectableContext'
import { dataAttr } from '../dataKey'
import { useNavItem } from './useNavItem'
import type { EventKey } from '../types'

export interface NavItemProps extends React.HTMLAttributes<HTMLElement> {
	/**
	 * NavItem을 활성 상태로 강조 표시합니다.
	 */
	active?: boolean

	/**
	 * component를 렌더링하는 데 사용되는 element입니다.
	 */
	as?: React.ElementType

	/**
	 * NavItem을 비활성화하여 선택할 수 없게 만듭니다.
	 */
	disabled?: boolean

	/**
	 * 'onSelect' 핸들러에 전달된 값으로, 선택한 NavItem을 식별하는 데 유용합니다.
	 */
	eventKey?: EventKey | null

	/**
	 * `a.href`에 해당하는 HTML `href` 속성입니다.
	 */
	href?: string

	ref?: React.Ref<HTMLElement>
}

export const NavItem = ({
	ref,
	as: Component = Button,
	active,
	eventKey,
	...options
}: NavItemProps) => {
	const [props, meta] = useNavItem({
		key: makeEventKey(eventKey, options.href),
		active,
		...options,
	})

	props[dataAttr('active')] = meta.isActive

	return <Component {...options} {...props} ref={ref} />
}
