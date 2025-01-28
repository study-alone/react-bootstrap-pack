import clsx from 'clsx'
import { style } from '@repo/dom-helper'
import { ENTERED, ENTERING, EXITED, EXITING } from '@repo/react-transition-group'
import { transitionEndListener } from './transitionEndListener'
import { triggerBorowserReflow } from './triggerBorowserReflow'
import { TransitionWrapper } from './TransitionWrapper'
import { noop } from './utils/noop'
import type { TransitionCallbacks } from '@repo/restart-ui'

type Dimension = 'height' | 'width'

export interface CollapseProps
	extends TransitionCallbacks,
		Pick<React.HTMLAttributes<HTMLElement>, 'role'> {
	className?: string
	in?: boolean
	mountOnEnter?: boolean
	unmountOnExit?: boolean
	appear?: boolean
	timeout?: number
	dimension?: Dimension | (() => Dimension)
	getDimensionValue?: (dimension: Dimension, element: HTMLElement) => number
	children(classNames: string, innerProps?: Record<string, unknown>): React.ReactNode
	nodeRef: React.RefObject<HTMLElement | null>
}

const MARGINS: {
	[d in Dimension]: ['marginTop' | 'marginLeft', 'marginBottom' | 'marginRight']
} = {
	height: ['marginTop', 'marginBottom'],
	width: ['marginLeft', 'marginRight'],
}

function getDefaultDimensionValue(dimension: Dimension, element: HTMLElement) {
	const value = dimension === 'height' ? element.offsetHeight : element.offsetWidth
	const margins = MARGINS[dimension]

	return margins.reduce((acc, margin) => acc + parseInt(style(element, margin) || '0', 10), value)
}

const collapseStyles = new Map([
	[EXITED, 'collapse'],
	[EXITING, 'collapsing'],
	[ENTERING, 'collapsing'],
	[ENTERED, 'collapse show'],
])

export const Collapse = ({
	onEnter = noop,
	onEntered = noop,
	onEntering = noop,
	onExit = noop,
	onExiting = noop,
	className,
	children,
	dimension = 'height',
	in: inProp = false,
	timeout = 300,
	mountOnEnter = false,
	unmountOnExit = false,
	appear = false,
	getDimensionValue = getDefaultDimensionValue,
	nodeRef,
	...restProps
}: CollapseProps) => {
	const computedDimension = typeof dimension === 'function' ? dimension() : dimension
	const nodeRefTyped = nodeRef

	const handleEnter = (isAppearing: boolean) => {
		if (nodeRefTyped.current) {
			nodeRefTyped.current.style[computedDimension] = '0'
		}
		onEnter(isAppearing)
	}

	const handleEntering = (isAppearing: boolean) => {
		if (nodeRefTyped.current) {
			const scroll = computedDimension === 'height' ? 'scrollHeight' : 'scrollWidth'

			nodeRefTyped.current.style[computedDimension] = `${nodeRefTyped.current[scroll]}px`
		}
		onEntering(isAppearing)
	}

	const handleEntered = (isAppearing: boolean) => {
		if (nodeRefTyped.current) {
			nodeRefTyped.current.style[computedDimension] = ''
		}
		onEntered(isAppearing)
	}

	const handleExit = () => {
		if (nodeRefTyped.current) {
			nodeRefTyped.current.style[computedDimension] =
				`${getDimensionValue(computedDimension, nodeRefTyped.current)}px`
			triggerBorowserReflow(nodeRefTyped.current)
		}
		onExit()
	}

	const handleExiting = () => {
		if (nodeRefTyped.current) {
			nodeRefTyped.current.style[computedDimension] = ''
		}
		onExiting()
	}

	return (
		<TransitionWrapper
			nodeRef={nodeRef}
			addEndListener={(done) => {
				if (nodeRefTyped.current) transitionEndListener(nodeRefTyped.current, done)
			}}
			{...restProps}
			aria-expanded={restProps.role ? inProp : null}
			onEnter={handleEnter}
			onEntering={handleEntering}
			onEntered={handleEntered}
			onExit={handleExit}
			onExiting={handleExiting}
			in={inProp}
			timeout={timeout}
			mountOnEnter={mountOnEnter}
			unmountOnExit={unmountOnExit}
			appear={appear}
		>
			{(status, innerProps) =>
				children(
					clsx(className, collapseStyles.get(status), {
						'collpase-horizontal': computedDimension === 'width',
					}),
					innerProps,
				)
			}
		</TransitionWrapper>
	)
}
