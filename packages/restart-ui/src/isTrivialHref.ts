export function isTrivialHref(href?: string): boolean {
	return !href || href.trim() === '#'
}
