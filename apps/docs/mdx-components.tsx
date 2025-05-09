// @ts-nocheck
import { useMDXComponents as getDocsMDXComponents } from 'nextra-theme-docs'

const {
	tr: Tr,
	th: Th,
	table: Table,
	img: NextraImage,
	pre: Pre,
	...docsComponents
} = getDocsMDXComponents()

const thList = [
	{ name: 'name', width: '116px' },
	{ name: 'required', width: '90px' },
	{ name: 'type', width: 'auto' },
	{ name: 'default value', width: 'auto' },
	{ name: 'description', width: 'auto' },
]

export const useMDXComponents: typeof getDocsMDXComponents = (components) => ({
	...docsComponents,
	tr: Tr,
	th: Th,
	thead: ({ children, ...props }) => {
		return (
			<thead {...props}>
				{children.props.children[0].props.children ? (
					children
				) : (
					<Tr>
						{thList.map(({ name, width }) => (
							<Th align="left" style={{ width: width }} key={name}>
								{name}
							</Th>
						))}
					</Tr>
				)}
			</thead>
		)
	},
	tbody: (props) => (
		<tbody
			className="break-words first:[&_td]:font-semibold first:[&_td]:text-violet-600 first:[&_td]:dark:text-violet-500 [&_tr]:!bg-transparent"
			{...props}
		/>
	),
	table: (props) => <Table className="w-full text-sm" {...props} />,
	img: (props) => (
		<NextraImage {...props} className="nextra-border rounded-xl border drop-shadow-sm" />
	),
	figure: (props) => <figure className="mt-6" {...props} />,
	figcaption: (props) => <figcaption className="mt-2 text-center text-sm" {...props} />,
	pre: (props) => {
		console.log('mdx-components > pre', props.children?.toString())
		return <Pre {...props} />
	},
	...components,
})
