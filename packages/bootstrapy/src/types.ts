import type {
	State,
	Placement as RestartUIPlacement,
	UsePopperOptions,
} from '@repo/restart-ui/usePopper'
import type { TransitionCallbacks } from '@repo/restart-ui'
import type { RenderChildren } from '@repo/react-transition-group'

export type Variant =
	| 'primary'
	| 'secondary'
	| 'success'
	| 'danger'
	| 'warning'
	| 'info'
	| 'dark'
	| 'light'
// | string

export type Omit<T, U> = Pick<T, Exclude<keyof T, keyof U>>

export type ReplaceProps<Inner extends React.ElementType, P> = Omit<
	React.ComponentPropsWithRef<Inner>,
	P
> &
	P

export interface BsPrefixOnlyProps {
	bsPrefix?: string
}

export interface AsProps<As extends React.ElementType = React.ElementType> {
	as?: As
}

export interface BsPrefixProps<As extends React.ElementType = React.ElementType>
	extends BsPrefixOnlyProps,
		AsProps<As> {}

export interface BsPrefixRefForwardingComponent<TInitial extends React.ElementType, P = unknown> {
	<As extends React.ElementType = TInitial>(
		props: React.PropsWithChildren<ReplaceProps<As, BsPrefixProps<As> & P>>,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		context?: any,
	): React.ReactElement | null
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	propTypes?: any
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	contextTypes?: any
	defaultProps?: Partial<P>
	displayName?: string
}

interface TransitionProps extends TransitionCallbacks {
	in?: boolean
	appear?: boolean
	// children: React.ReactElement
	mountOnEnter?: boolean
	unmountOnExit?: boolean
}

export type TransitionType =
	| boolean
	| React.FC<Omit<TransitionProps, 'children'> & { children: RenderChildren }>

export type Color =
	| 'primary'
	| 'secondary'
	| 'success'
	| 'danger'
	| 'warning'
	| 'info'
	| 'dark'
	| 'light'
	| 'white'
	| 'muted'

export type ButtonVariant =
	| Variant
	| 'link'
	| 'outline-primary'
	| 'outline-secondary'
	| 'outline-success'
	| 'outline-danger'
	| 'outline-warning'
	| 'outline-info'
	| 'outline-dark'
	| 'outline-light'

export type GapValue = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8

export type ResponsiveBreakpoint = 'sm' | 'md' | 'lg' | 'xl' | 'xxl'

export type AlignDirection = 'start' | 'end'

export type ResponsiveAlignProp =
	| { sm: AlignDirection }
	| { md: AlignDirection }
	| { lg: AlignDirection }
	| { xl: AlignDirection }
	| { xxl: AlignDirection }
	| Record<string, AlignDirection>

export type AlignType = AlignDirection | ResponsiveAlignProp

export type Placement = RestartUIPlacement

export type RootCloseEvent = 'click' | 'mousedown'

export interface PopperRef {
	state: State | undefined
	outOfBoundaries: boolean
	placement: Placement | undefined
	scheduleUpdate?: () => void
	strategy: UsePopperOptions['strategy']
}
