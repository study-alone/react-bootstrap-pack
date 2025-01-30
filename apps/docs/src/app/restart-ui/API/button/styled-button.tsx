'use client'

import { Button, type ButtonProps } from '@repo/restart-ui/Button'
import clsx from 'clsx'

export const StyledButton = (props: ButtonProps<HTMLButtonElement>) => {
	return (
		<Button
			{...props}
			className={clsx(
				props.className,
				'transition text-md',
				'h-10 bg-white border border-primary text-blue-400 rounded px-8 mt-4 appearance-none text-center whitespace-no-wrap',
				'focus:outline-none focus:ring-4 ring-primary-200',
				!props.disabled && 'cursor-pointer hover:bg-primary hover:text-blue-600',
				'active:bg-primary-600 active:text-white',
				props.disabled && 'cursor-not-allowed opacity-60',
			)}
		/>
	)
}
