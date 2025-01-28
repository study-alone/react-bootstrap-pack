export const safeFindDOMNode = (
	componentOrElement: React.Component | Element | null | undefined,
) => {
	return (componentOrElement ?? null) as Element | Text | null
}
