import type { NextConfig } from 'next'
import nextra from 'nextra'

const withNextra = nextra({
	latex: true,
	search: {
		codeblocks: false,
	},
	// contentDirBasePath: '/docs',
})

/**
 * @type {import('next').NextConfig}
 */
const nextConfig: NextConfig = {
	/* config options here */
	reactStrictMode: true,
	output: 'export',
	images: {
		unoptimized: true,
	},
	webpack: (config, { dev }) => {
		config.module.rules.push({
			test: /\.svg$/,
			use: ['@svgr/webpack'],
		})

		if (dev) {
			config.watchOptions = {
				poll: 1000,
				aggregateTimeout: 300,
			}
		}

		return config
	},
}

export default withNextra(nextConfig)
