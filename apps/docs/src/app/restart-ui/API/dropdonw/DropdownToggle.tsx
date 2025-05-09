'use client'

import { useDropdownMenu } from '@repo/restart-ui'

export const DropdownToggle = () => {
	const [menuProps, meta] = useDropdownMenu<HTMLUListElement>({
		flip: true,
		offset: [0, 8],
	})

	return (
		<ul
			{...menuProps}
			style={{
				visibility: meta.show ? 'visible' : 'hidden',
			}}
		/>
	)
}
