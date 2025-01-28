import { type ButtonProps, Button as BaseButton } from '@repo/restart-ui/Button'
import clsx from 'clsx'

export const Button = (props: ButtonProps<'button'>) => (
	<BaseButton
		{...props}
		className={clsx(
			props.className,
			'transition text-md',
			'h-10 cursor-pointer bg-white border border-primary text-primary rounded px-8 mt-4 appearance-none text-center whitespace-no-wrap',
			'focus:outline-none focus:ring-4 ring-primary-200',
			'hover:bg-primary hover:text-white',
			'active:bg-primary-600 active:text-white',
			props.disabled && 'cursor-not-allowed opacity-60',
		)}
	/>
)
