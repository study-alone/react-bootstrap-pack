import { generateStaticParamsFor, importPage } from 'nextra/pages'
import { useMDXComponents as getComponents } from '@/mdx-components'

export const generateStaticParams = generateStaticParamsFor('mdxPath')

type Props = {
	params: Promise<{ mdxPath: string[] }>
	searchParams: Promise<{}>
}

export async function generateMetadata({ params, searchParams }: Props) {
	const { mdxPath } = await params
	const { metadata } = await importPage(mdxPath)
	console.log('metadata', metadata)
	return metadata
}

const { wrapper: Wrapper } = getComponents()

export default async function Page({ params, searchParams }: Props) {
	const { mdxPath } = await params
	const result = await importPage(mdxPath)
	console.log(result)
	const { default: MDXContent, toc, metadata } = result

	return (
		<Wrapper toc={toc} metadata={metadata}>
			<MDXContent {...{ params, searchParams }} params={params} />
		</Wrapper>
	)
}
