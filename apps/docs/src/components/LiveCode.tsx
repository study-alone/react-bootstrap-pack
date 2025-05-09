'use client'

import { LiveEditor, LiveError, LivePreview, LiveProvider } from 'react-live'
import { themes } from 'prism-react-renderer'
import { useState } from 'react'
import { ClipboardIcon, CheckIcon, PhotoIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
// import holderjs from 'holderjs'
// import { Stack } from '@/bootstrap/layout/Stack'
import { Button } from '@repo/restart-ui'
import { Pre } from 'nextra/components'

interface LiveCodeProps {
	code: string
	noInline?: boolean
	scope?: Record<string, unknown>
	previewOnlyJSX?: boolean
	onlyPreview?: boolean
	title?: string
}

// const removeRenderRegexp = /render\([^)]*\)/g

const extractReturnContent = (code: string) => {
	// React 컴포넌트 함수 패턴 확인 (순수 익명 함수 포함)
	const componentFunctionPattern = /^\s*\(.*\)\s*=>\s*{?/

	// JSX를 포함하는 return 구문 추출을 위한 정규표현식
	const returnJSXPattern = /return\s*\(\s*([\s\S]*?)\s*\)(?:;|\s*})?/

	// 먼저 React 컴포넌트 함수 패턴인지 확인
	if (componentFunctionPattern.test(code)) {
		const jsxMatch = code.match(returnJSXPattern)
		return jsxMatch ? jsxMatch.at(1)?.trim() : code
	}

	// 컴포넌트 함수가 아니라면 원본 코드 반환
	return code
}

interface HeaderSectionProps {
	title?: string
}

const HeaderSection = ({ title }: HeaderSectionProps) => {
	return (
		<div className="x:px-4 x:text-xs x:text-gray-700 x:dark:text-gray-200 x:bg-gray-100 x:dark:bg-neutral-900 x:flex x:items-center x:h-12 x:gap-2 x:rounded-t-md x:border x:border-gray-300 x:dark:border-neutral-700 x:contrast-more:border-gray-900 x:contrast-more:dark:border-gray-50 x:border-b-0">
			<PhotoIcon width={20} />
			<span>{title}</span>
		</div>
	)
}

interface AreaProps {
	children: React.ReactNode
}

const Area = ({ children }: AreaProps) => {
	return (
		<div className="x:group x:focus-visible:nextra-focus x:overflow-auto x:subpixel-antialiased x:text-[.9em] x:bg-white x:dark:bg-black x:py-4 x:px-4 x:ring-1 x:ring-inset x:ring-gray-300 x:dark:ring-neutral-700 x:contrast-more:ring-gray-900 x:contrast-more:dark:ring-gray-50 x:contrast-more:contrast-150 x:rounded-b-md not-prose">
			{children}
		</div>
	)
}

export const LiveCode = ({
	code,
	noInline = false,
	scope,
	previewOnlyJSX = true,
	onlyPreview = false,
	title,
}: LiveCodeProps) => {
	const [animateTriiger, setAnimateTrigger] = useState(false)

	// const replaceRenderCode = code.replace(removeRenderRegexp, '').trim()

	const handleCopy = () => {
		setAnimateTrigger((state) => !state)
		window.setTimeout(() => {
			setAnimateTrigger(false)
		}, 2000)
	}

	return (
		<LiveProvider
			code={code}
			noInline={noInline}
			scope={Object.assign({}, scope, { clsx })}
			theme={themes.vsDark}
		>
			<div className="live-preview flex flex-col gap-4 mt-6">
				<section className="flex flex-col">
					<HeaderSection title={`Preview - ${title}`} />
					<Area>
						<LivePreview />
					</Area>
				</section>
				{!onlyPreview && (
					<section className="flex flex-col">
						<HeaderSection title={`Code`} />
						<Area>
							<Button
								// variant="info"
								className={clsx('btn-copy', 'absolute', 'text-body-tertiary', {
									animate: animateTriiger,
								})}
								onClick={handleCopy}
							>
								<span hidden>copy</span>
								<span className="icon-wrapper">
									<ClipboardIcon strokeWidth={2} width={20} />
									<CheckIcon color="green" width={20} strokeWidth={2} />
								</span>
							</Button>
							<LiveEditor
								code={previewOnlyJSX ? extractReturnContent(code) : code}
								tabMode="indentation"
								disabled
							/>
						</Area>
					</section>
				)}
			</div>
			<LiveError />
		</LiveProvider>
	)
}
