/* eslint-env node */
import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Banner, Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import LogoSVG from '../../public/logo.svg'
import './globals.css'

export const metadata = {
	metadataBase: new URL('https://nextra.site'),
	title: {
		default: 'Nextra',
		template: '%s - Nextra',
	},
	description: 'Nextra: the Next.js site builder',
	applicationName: 'Nextra',
	generator: 'Next.js',
	appleWebApp: {
		title: 'Nextra',
	},
	other: {
		'msapplication-TileImage': '/ms-icon-144x144.png',
		'msapplication-TileColor': '#fff',
	},
	twitter: {
		site: 'https://nextra.site',
	},
}

type Props = {
	children: React.ReactNode
}

export default async function RootLayout({ children }: Props) {
	return (
		<html lang="en" dir="ltr" suppressHydrationWarning>
			<Head faviconGlyph="✦">
				<link rel="stylesheet" href="/bootstrap-scoped.css" />
			</Head>
			<body>
				<Layout
					// banner={<Banner storageKey="Nextra 2">Nextra 2 Alpha</Banner>}
					navbar={
						<Navbar
							logo={
								<div className="w-[78px]">
									{/* <img src="/logo.svg" alt="logo" /> */}
									<LogoSVG
										fill="currentColor"
										width="100%"
										height="100%"
										viewBox="0 0 1200 427"
									/>
								</div>
							}
							// Next.js discord server
							chatLink="https://discord.gg/hEM84NMkRv"
						/>
					}
					footer={<Footer />}
					editLink="Edit this page on GitHub"
					docsRepositoryBase="https://github.com/shuding/nextra/blob/main/examples/docs"
					sidebar={{ defaultMenuCollapseLevel: 1 }}
					pageMap={await getPageMap()}
				>
					{children}
				</Layout>
			</body>
		</html>
	)
}
