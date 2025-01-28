import { createContext } from 'react'

interface FormContextValue {
	controlId?: string
}

export const FormContext = createContext<FormContextValue>({})
