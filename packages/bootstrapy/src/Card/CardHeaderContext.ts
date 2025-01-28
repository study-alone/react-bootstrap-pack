import { createContext } from 'react'

interface CardHeaderContextValue {
	cardHeaderBsPrefix: string
}

export const CardHeaderContext = createContext<CardHeaderContextValue | null>(null)
CardHeaderContext.displayName = 'CardHeaderContext'
