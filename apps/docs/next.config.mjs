// import type { NextConfig } from 'next'
import nextra from 'nextra'
import remarkEmoji from 'remark-emoji'
import { visit } from 'unist-util-visit'
// import rehypePrettyCode from 'rehype-pretty-code'
// import { bundledLanguages, createHighlighter } from 'shiki'

// const CODE_BLOCK_FILENAME_RE = /filename="([^"]+)"/
// const DEFAULT_REHYPE_PRETTY_CODE_OPTIONS = {
// 	keepBackground: false,
// 	grid: false,
// 	onVisitLine(node) {
// 		if (node.children.length === 0) {
// 			node.children.push({ type: 'text', value: ' ' })
// 		}
// 		delete node.properties['data-line']
// 	},
// 	theme: {
// 		light: 'github-light',
// 		dark: 'github-dark',
// 	},
// 	defaultLang: {
// 		block: 'plaintext',
// 	},
// 	filterMetaString: (meta) => meta.replace(CODE_BLOCK_FILENAME_RE, ''),
// 	getHighlighter(opts) {
// 		return createHighlighter({
// 			...opts,
// 			// Without `getHighlighter` option ```mdx lang isn't highlighted
// 			langs: Object.keys(bundledLanguages),
// 		})
// 	},
// }

const withNextra = nextra({
	latex: true,
	search: {
		codeblocks: false,
	},
	// contentDirBasePath: '/docs',
	// codeHighlight: false,
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
	transpilePackages: ['remark-emoji'],
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
