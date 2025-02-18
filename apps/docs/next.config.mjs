// import type { NextConfig } from 'next'
import nextra from 'nextra'
import remarkEmoji from 'remark-emoji'

const withNextra = nextra({
	latex: true,
	search: {
		codeblocks: false,
	},
	// contentDirBasePath: '/docs',
	mdxOptions: {
		remarkPlugins: [remarkEmoji],
	},
})

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
	/* config options here */
	reactStrictMode: true,
	experimental: {
		esmExternals: true,
	},
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
