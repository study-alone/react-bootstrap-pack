import { useState } from 'react'
import { useIsomorphicEffect } from './useIsomorphicEffect'

interface RefCountedMediaQueryList extends MediaQueryList {
	refCount: number
}

const matchersByWindow = new WeakMap<Window, Map<string, RefCountedMediaQueryList>>()

const getMatcher = (query: string | null, targetWindow?: Window) => {
	if (!query || !targetWindow) return

	const matchers =
		matchersByWindow.get(targetWindow) || new Map<string, RefCountedMediaQueryList>()

	matchersByWindow.set(targetWindow, matchers)

	// MediaQueryList
	let mql = matchers.get(query)
	if (!mql) {
		mql = targetWindow.matchMedia(query) as RefCountedMediaQueryList
		mql.refCount = 0
		matchers.set(mql.media, mql)
	}

	return mql
}

/**
 * 미디어 쿼리를 매치하고 매치가 변경되면 업데이트를 받습니다.
 * 미디어 문자열은 `window.matchMedia`에 직접 전달되고 useLayoutEffect로 실행되므로
 * 브라우저가 페인트할 기회를 갖기 전에 초기 매치가 반환됩니다.
 *
 * ```tsx
 * function Page() {
 *   const isWide = useMediaQuery('min-width: 1000px')
 *
 *   return isWide ? "very wide" : 'not so wide'
 * }
 * ```
 *
 * 미디어 쿼리 목록도 전역적으로 재사용되고,
 * 동일한 쿼리에 대한 hook 호출은 내부적으로 매처를 한 번만 생성합니다.
 *
 * @param query A media query
 * @param targetWindow The window to match against, uses the globally available one as a default.
 */
export const useMediaQuery = (
	query: string | null,
	targetWindow: Window | undefined = typeof window === 'undefined' ? undefined : window,
) => {
	const mql = getMatcher(query, targetWindow)
	const [matches, setMatches] = useState(() => (mql ? mql.matches : false))

	useIsomorphicEffect(() => {
		let mql = getMatcher(query, targetWindow)

		if (!mql) {
			return setMatches(false)
		}

		const matchers = matchersByWindow.get(targetWindow!)

		const handleChange = () => {
			if (mql) {
				setMatches(mql.matches)
			}
		}

		mql.refCount++

		if ('addEventListener' in mql) {
			mql.addEventListener('change', handleChange)
		} else if ('addListener' in mql) {
			;(mql as RefCountedMediaQueryList).addListener(handleChange)
		}

		handleChange()

		return () => {
			if (!mql) {
				throw new Error('`mql` is not available')
			}

			if ('removeListener' in mql) {
				mql.removeListener(handleChange)
			} else if ('removeEventListener' in mql) {
				;(mql as RefCountedMediaQueryList).removeEventListener('change', handleChange)
			}

			mql.refCount--

			if (mql.refCount <= 0) {
				matchers?.delete(mql.media)
			}
			mql = undefined
		}
	}, [query, targetWindow])

	return matches
}
