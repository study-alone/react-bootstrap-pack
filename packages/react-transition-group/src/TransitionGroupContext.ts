import { createContext, useContext } from 'react'

type TransitionGroupContextValue = {
	isMounting: boolean
}

/**
 * @description transition group의 mounting 여부를 공유하는 context
 */
export const TransitionGroupContext = createContext<TransitionGroupContextValue>({
	isMounting: false,
})

export const useTransitionGroupContext = () => {
	return useContext(TransitionGroupContext)
}
