export const getMsNumber = (time?: string) => {
	if (!time) return 0

	// Regular expression to match time format
	const timeRegex = /^(\d+(\.\d+)?)(ms|s)$/
	const match = time.match(timeRegex)

	if (!match) {
		throw new Error("Invalid time format. Expected formats are '10s', '0.2s', or '100ms'.")
	}

	const value = parseFloat(match[1] as string) // Extract the numeric part
	const unit = match[3] // Extract the unit (ms or s)

	if (unit === 'ms') {
		return value // Already in milliseconds
	} else if (unit === 's') {
		return value * 1000 // Convert seconds to milliseconds
	} else {
		throw new Error("Unsupported time unit. Only 's' and 'ms' are allowed.")
	}
}
