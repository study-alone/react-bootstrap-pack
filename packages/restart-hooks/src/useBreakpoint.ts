import { useMemo } from 'react'
import { useMediaQuery } from './useMediaQuery'

export type BreakpointDirection = 'up' | 'down' | true

export type BreakpointMap<TKey extends string> = Partial<Record<TKey, BreakpointDirection>>

/**
 * @description
 * breakpoint 이름과 width로 반응형 hook를 만듭니다. 유효한 css 단위와 숫자(픽셀)를 사용할 수 있습니다.
 *
 * @note 객체 키 순서는 중요합니다! 가장 작은 것부터 가장 큰 것까지 순서대로 정렬되어 있다고 가정합니다.
 *
 * ```ts
 * const useBreakpoint = createBreakpointHook({
 *  xs: 0,
 *  sm: 576,
 *  md: 768,
 *  lg: 992,
 *  xl: 1200,
 * })
 * ```
 *
 * @warn 문자열 값을 사용하면 때때로 css `calc()`를 사용하여 미디어 쿼리를 구성하는 경우가 있는데, 이는 현재 모든 브라우저에서 미디어 쿼리를 지원하지 않습니다. 가장 광범위한 브라우저 지원을 위해 숫자를 사용하세요.
 *
 * @param breakpointValues A object hash of names to breakpoint dimensions
 */
export const createBreakpointHook = <TKey extends string>(
	breakpointValues: Record<TKey, string | number>,
) => {
	const names = Object.keys(breakpointValues) as TKey[]

	const and = (query: string, next: string) => {
		if (query === next) {
			return next
		}
		return query ? `${query} and ${next}` : next
	}

	const getNext = (breakpoint: TKey) => {
		return names[Math.min(names.indexOf(breakpoint) + 1, names.length - 1)]
	}

	const getMaxQuery = (breakpoint: TKey) => {
		const next = getNext(breakpoint)
		let value = breakpointValues[next!]

		if (typeof value === 'number') {
			value = `${value - 0.2}px`
		} else {
			value = `calc(${value} - 0.2px)`
		}

		return `(max-width: ${value})`
	}

	const getMinQuery = (breakpoint: TKey) => {
		let value = breakpointValues[breakpoint]
		if (typeof value === 'number') {
			value = `${value}px`
		}
		return `(min-width: ${value})`
	}

	/**
	 * Match a set of breakpoints
	 *
	 * ```tsx
	 * const MidSizeOnly = () => {
	 *   const isMid = useBreakpoint({ lg: 'down', sm: 'up' });
	 *
	 *   if (isMid) return <div>On a Reasonable sized Screen!</div>
	 *   return null;
	 * }
	 * ```
	 * @param breakpointMap An object map of breakpoints and directions, queries are constructed using "and" to join
	 * breakpoints together
	 * @param window Optionally specify the target window to match against (useful when rendering into iframes)
	 */
	function useBreakpoint(breakpointMap: BreakpointMap<TKey>, window?: Window): boolean
	/**
	 * Match a single breakpoint exactly, up, or down.
	 *
	 * ```tsx
	 * const PhoneOnly = () => {
	 *   const isSmall = useBreakpoint('sm', 'down');
	 *
	 *   if (isSmall) return <div>On a Small Screen!</div>
	 *   return null;
	 * }
	 * ```
	 *
	 * @param breakpoint The breakpoint key
	 * @param direction A direction 'up' for a max, 'down' for min, true to match only the breakpoint
	 * @param window Optionally specify the target window to match against (useful when rendering into iframes)
	 */
	function useBreakpoint(
		breakpoint: TKey,
		direction?: BreakpointDirection,
		window?: Window,
	): boolean
	function useBreakpoint(
		breakpointOrMap: TKey | BreakpointMap<TKey>,
		direction?: BreakpointDirection | Window,
		window?: Window,
	): boolean {
		let breakpointMap: BreakpointMap<TKey>

		if (typeof breakpointOrMap === 'object') {
			breakpointMap = breakpointOrMap
			window = direction as Window
			direction = true
		} else {
			direction = direction || true
			breakpointMap = { [breakpointOrMap]: direction } as Record<TKey, BreakpointDirection>
		}

		const query = useMemo(
			() =>
				Object.entries(breakpointMap).reduce((query, [k, d]) => {
					const key = k as TKey
					const direction = d as BreakpointDirection

					if (direction === 'up' || direction === true) {
						query = and(query, getMinQuery(key))
					}

					if (direction === 'down' || direction === true) {
						query = and(query, getMaxQuery(key))
					}

					return query
				}, ''),
			// eslint-disable-next-line react-hooks/exhaustive-deps
			[JSON.stringify(breakpointMap)],
		)

		return useMediaQuery(query, window)
	}

	return useBreakpoint
}

export type DefaultBreakpoints = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
export type DefaultBreakpointMap = BreakpointMap<DefaultBreakpoints>

export const useBreakpoint = createBreakpointHook<DefaultBreakpoints>({
	xs: 0,
	sm: 576,
	md: 768,
	lg: 992,
	xl: 1200,
	xxl: 1400,
})
