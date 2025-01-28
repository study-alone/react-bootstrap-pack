import tailwindcss from 'tailwindcss'
import prefixWrap from 'postcss-prefixwrap'
import autoprefixer from 'autoprefixer'

/** @type {import('postcss-load-config').Config} */
const config = {
	plugins: {
		'@tailwindcss/postcss': {},
		// tailwindcss: {},
		// Autoprefixer can be used to add browser vendor prefixes (optional)
		autoprefixer: {},
		// Add your custom prefix here
		// 'postcss-prefixwrap': '.bootstrapy',
	},
}

export default config
