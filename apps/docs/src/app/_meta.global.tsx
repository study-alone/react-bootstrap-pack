import type { MetaRecord } from 'nextra'

const meta = {
	index: {
		display: 'hidden',
	},
	docs: {
		type: 'page',
		title: 'Documentation',
		items: {
			index: '',
			'get-started': '',
			features: '',
			themes: {
				// blog: {
				// 	type: 'page',
				// 	title: 'Blog Themes',
				// },
				// docs: {
				// 	type: 'page',
				// 	title: 'Docs Themes',
				// 	items: {
				// 		index: '',
				// 		bleed: '',
				// 	},
				// },
			},
			advanced: '',
		},
	},
	blog: {
		type: 'page',
		title: 'Blog',
	},
	'restart-ui': {
		type: 'page',
		title: 'Restart UI',
		items: {
			'get-started': '',
			API: '',
		},
	},
}

export default meta
