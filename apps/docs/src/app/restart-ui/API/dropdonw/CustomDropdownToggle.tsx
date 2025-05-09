'use client'

import { Dropdown } from '@repo/restart-ui'

export const CustomDropdownToggle = () => {
	return (
		<Dropdown.Menu flip offset={[0, 8]}>
			{({ ref, ...menuProps }, meta) => (
				<ul
					ref={(node) => {
						if (typeof ref === 'function') ref(node)
					}}
					{...menuProps}
					style={{
						visibility: meta.show ? 'visible' : 'hidden',
					}}
				/>
			)}
		</Dropdown.Menu>
	)
}
