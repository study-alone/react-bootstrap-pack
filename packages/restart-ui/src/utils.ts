import { version } from 'react'

export const isEscKey = (event: KeyboardEvent) => {
	return event.code === 'Escape' || event.key === 'Escape'
}

export const getReactVersion = () => {
	const parts = version.split('.')
	return {
		major: Number(parts[0]),
		minor: Number(parts[1]),
		patch: Number(parts[2]),
	}
}
