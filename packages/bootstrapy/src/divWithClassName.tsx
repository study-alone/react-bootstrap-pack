import clsx from 'clsx'

export const divWithClassName = (className: string, name?: string) => {
	const Component = ({ ref, ...props }: React.ComponentProps<'div'>) => (
		<div {...props} ref={ref} className={clsx(props.className, className)} />
	)

	Component.displayName = name || 'divWithClassName'

	return Component
}
