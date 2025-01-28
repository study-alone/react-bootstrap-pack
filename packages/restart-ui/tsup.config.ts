import fs from 'node:fs/promises'
import { defineConfig, type Options } from 'tsup'

type Format = 'cjs' | 'esm' | 'iife'
type CustomOptions = {
	outDir: string
	format: Format[]
	dts?: Options['dts']
	esbuildOptions?: Options['esbuildOptions']
	onSuccess?: Options['onSuccess']
}

const esbuildOptions: Options['esbuildOptions'] = (options) => {
	options.plugins = [
		{
			name: 'add-use-client-directive',
			setup(build) {
				build.onLoad({ filter: /\.js$/ }, async (args) => {
					const content = await fs.readFile(args.path, 'utf8')
					const updatedContent = `'use client';\n${content}`

					return {
						contents: updatedContent,
						loader: 'js',
					}
				})
			},
		},
	]
}

const baseConfig = ({ outDir, format, dts = false, onSuccess }: CustomOptions): Options => ({
	entry: ['src/index.{ts,tsx}', 'src/*.{ts,tsx}', 'src/**/*.{ts,tsx}'],
	outDir,
	format,
	dts,
	clean: true,
	treeshake: true,
	splitting: true,
	cjsInterop: true,
	sourcemap: true,
	esbuildOptions: esbuildOptions,
	onSuccess,
})

export default defineConfig([
	baseConfig({
		outDir: './dist/cjs',
		format: ['cjs'],
		esbuildOptions,
	}),
	baseConfig({
		outDir: './dist/esm',
		format: ['esm'],
		esbuildOptions,
		onSuccess: 'node ./addUseClient.js',
	}),
	baseConfig({
		outDir: './dist/types',
		format: ['esm'],
		dts: { only: true },
	}),
])
