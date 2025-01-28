import clsx from 'clsx'
import { useCol } from './useCol'
import type { ColProps } from './types'

export type { ColProps }

export const Col =
	// Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
	({ ref, ...props }: ColProps) => {
		const [{ className, ...colProps }, { as: Component = 'div', bsPrefix, spans }] =
			useCol(props)

		return (
			<Component
				{...colProps}
				ref={ref}
				className={clsx(className, { [`${bsPrefix}`]: !spans?.length })}
			/>
		)
	}
