'use client'

import { useState } from 'react'

export const Counter = () => {
	const [count, setCount] = useState(0)

	return (
		<>
			<button type="button" onClick={() => setCount((prev) => prev + 1)}>
				increase
			</button>
			<span>{count}</span>
		</>
	)
}
