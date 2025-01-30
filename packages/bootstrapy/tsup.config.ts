import { defineConfig, type Options } from 'tsup'
import sass from 'sass'
import autoprefixer from 'autoprefixer'
import postcss from 'postcss'

type Format = 'cjs' | 'esm' | 'iife'
type CustomOptions = {
	outDir: string
	format: Format[]
	dts?: Options['dts']
}

const baseConfig = ({ outDir, format, dts = false }: CustomOptions): Options => ({
	entry: ['src/index.{ts,tsx}', 'src/*.{ts,tsx}', 'src/**/*.{ts,tsx}'],
	outDir,
	format,
	dts,
	clean: true,
	treeshake: true,
	splitting: true,
	cjsInterop: true,
	sourcemap: true,
})

const styleConfig = (): Options => ({
	entry: ['src/scss/bootstrap.scss'],
	// clean: true,
	esbuildPlugins: [
		{
			name: 'scss',
			setup(build) {
				build.onResolve({ filter: /\.scss$/ }, (args) => {
					return { path: args.path, namespace: 'scss' }
				})

				build.onLoad({ filter: /.*/, namespace: 'scss' }, async (args) => {
					const result = sass.compile(args.path)
					const cssWithPrefixes = await postcss([autoprefixer]).process(result.css, {
						from: undefined,
					})

					return {
						contents: cssWithPrefixes.css,
						loader: 'css',
					}
				})
			},
		},
	],
})

export default defineConfig([
	styleConfig(),
	baseConfig({ outDir: './dist/cjs', format: ['cjs'] }),
	baseConfig({ outDir: './dist/esm', format: ['esm'] }),
	baseConfig({ outDir: './dist/types', format: ['esm'], dts: { only: true } }),
])
