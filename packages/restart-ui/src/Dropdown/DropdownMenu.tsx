import { useContext, useRef } from 'react'
import { useCallbackRef } from '@repo/restart-hooks'
import { useClickOutside, type ClickOutsideOptions } from '../useClickOutside'
import { mergeOptionsWithPopperConfig } from '../mergeOptionsWithPopperConfig'
import { usePopper } from '../usePopper'
import { DropdownContext, type DropdownContextValue } from './DropdownContext'
import type { UsePopperOptions, Placement, Offset, UsePopperState } from '../usePopper'

export interface UseDropdownMenuOptions {
	/**
	 * Popper.js `flip` modifier를 활성화하여 드롭다운이 뷰포트 또는 토글과 겹치는 경우
	 * 자동으로 배치를 조정할 수 있습니다.
	 * 자세한 내용은 [flip 문서](https://popper.js.org/docs/v2/modifiers/flip/)를 참조하세요.
	 */
	flip?: boolean

	/**
	 * 메뉴의 표시 상태를 제어합니다.
	 * 일반적으로 이는 부모 `Dropdown` 에서 제공하지만 prop으로 직접 지정할 수도 있습니다.
	 */
	show?: boolean

	/**
	 * Popper에서 `fixed` 위치 지정 전략을 사용합니다.
	 * 드롭다운 토글이 고정된 컨테이너에 있는 경우 사용됩니다.
	 */
	fixed?: boolean

	/**
	 * 드롭다운 메뉴를 토글과 관련하여 배치하기 위한 PopperJS 배치입니다.
	 * 일반적으로 이는 부모 `Dropdown` 구성 요소에서 제공하지만
	 * prop으로 직접 지정할 수도 있습니다.
	 */
	placement?: Placement

	/**
	 * 메뉴 위치를 정하기 위해 Popper를 사용할지 여부
	 */
	usePopper?: boolean

	/**
	 * 스크롤을 추가하고 리스너를 업데이트 메뉴 위치로 크기를 조정할지 여부.
	 *
	 * See the [event listeners docs](https://popper.js.org/docs/v2/modifiers/event-listeners/)
	 * for more info.
	 */
	enableEventListeners?: boolean

	/**
	 * 드롭 다운 토글에서 드롭 다운 메뉴의 오프셋.
	 * See the [offset docs](https://popper.js.org/docs/v2/modifiers/offset/) for more info.
	 */
	offset?: Offset

	/**
	 * RootCloseWrapper에서 사용하는 기본 이벤트를 재정의합니다.
	 */
	rootCloseEvent?: ClickOutsideOptions['clickTrigger']

	/**
	 * react-popper의 Popper 컴포넌트에 직접 전달되는 일련의 Popper 옵션과 속성입니다.
	 */
	popperConfig?: Omit<UsePopperOptions, 'enabled' | 'placement'>
}

export interface UserDropdownMenuProps<E extends HTMLElement = HTMLElement>
	extends Record<string, unknown>,
		React.RefAttributes<E> {
	style?: React.CSSProperties
	'aria-labelledby'?: string
}

export interface UserDropdownMenuArrowProps
	extends Record<string, unknown>,
		React.RefAttributes<HTMLElement> {
	style: React.CSSProperties | Partial<CSSStyleDeclaration>
}

export interface UseDropdownMenuMetadata {
	show: boolean
	placement?: Placement
	hasShown: boolean
	toggle?: DropdownContextValue['toggle']
	popper: UsePopperState | null
	arrowProps: Partial<UserDropdownMenuArrowProps>
}

const noop = () => {}

/**
 * @memberOf Dropdown
 * @param {object}  options
 * @param {boolean} options.flip 뷰포트 가장자리 감지를 기반으로 메뉴 '드롭' 위치를 자동으로 조정합니다.
 * @param {[number, number]} options.offset 메뉴와 토글 사이의 오프셋 거리를 정의합니다.
 * @param {boolean} options.show `드롭다운` 컨텍스트에서 무시된 메뉴를 수동으로 표시합니다.
 * @param {boolean} options.usePopper PopperJS를 사용하여 메뉴를 배치하는 것을 선택/해제합니다. 비활성화하면 직접 배치해야 합니다.
 * @param {string}  options.rootCloseEvent 닫기를 트리거하기 위해 메뉴 "외부 클릭"을 결정할 때 수신하는 포인터 이벤트입니다.
 * @param {object}  options.popperConfig Options passed to the [`usePopper`](/api/usePopper) hook.
 */
export function useDropdownMenu<E extends HTMLElement = HTMLElement>(
	options: UseDropdownMenuOptions = {},
) {
	const context = useContext(DropdownContext)
	const [arrowElement, attachArrowRef] = useCallbackRef<Element>()
	const hasShownRef = useRef(false)

	const {
		flip,
		offset,
		rootCloseEvent,
		fixed = false,
		placement: placementOverride,
		popperConfig = {},
		enableEventListeners = true,
		usePopper: shouldUsePopper = !!context,
	} = options

	const show = context?.show == null ? !!options.show : context?.show

	if (show && !hasShownRef.current) {
		hasShownRef.current = true
	}

	const handleClose = (event: React.MouseEvent | React.KeyboardEvent | Event) => {
		context?.toggle(false, event)
	}

	const { placement, setMenu, menuElement, toggleElement } = context || {}

	const popper = usePopper(
		toggleElement,
		menuElement,
		mergeOptionsWithPopperConfig({
			placement: placementOverride || placement || 'bottom-start',
			enabled: shouldUsePopper,
			enableEvents: enableEventListeners == null ? show : enableEventListeners,
			offset,
			flip,
			fixed,
			arrowElement,
			popperConfig,
		}),
	)

	const menuProps: UserDropdownMenuProps<E> = {
		ref: setMenu || noop,
		'aria-labelledby': toggleElement?.id,
		...popper.attributes.popper,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		style: popper.styles.popper as any,
	}

	const metadata: UseDropdownMenuMetadata = {
		show,
		placement,
		hasShown: hasShownRef.current,
		toggle: context?.toggle,
		popper: shouldUsePopper ? popper : null,
		arrowProps: shouldUsePopper
			? {
					ref: attachArrowRef,
					...popper.attributes.arrow,
					style: popper.styles.arrow,
				}
			: {},
	}

	useClickOutside(menuElement, handleClose, {
		clickTrigger: rootCloseEvent,
		disabled: !show,
	})

	return [menuProps, metadata] as const
}

export interface DropdownMenuProps extends UseDropdownMenuOptions {
	/**
	 * A render prop that returns a Menu element. The `props`
	 * argument should be spread through to **a component that can accept a ref**.
	 *
	 * @type {Function ({
	 *   show: boolean,
	 *   close: (?SyntheticEvent) => void,
	 *   placement: Placement,
	 *   update: () => void,
	 *   forceUpdate: () => void,
	 *   props: {
	 *     ref: (?HTMLElement) => void,
	 *     style: { [string]: string | number },
	 *     aria-labelledby: ?string
	 *   },
	 *   arrowProps: {
	 *     ref: (?HTMLElement) => void,
	 *     style: { [string]: string | number },
	 *   },
	 * }) => React.Element}
	 */
	children: (props: UserDropdownMenuProps, meta: UseDropdownMenuMetadata) => React.ReactNode
}

/**
 * Also exported as `<Dropdown.Menu>` from `Dropdown`.
 */
export const DropdownMenu = ({
	children,
	usePopper: usePopperProp = true,
	...options
}: DropdownMenuProps) => {
	const [props, meta] = useDropdownMenu({
		...options,
		usePopper: usePopperProp,
	})

	return <>{children(props, meta)}</>
}
