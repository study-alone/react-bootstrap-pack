import { defineConfig, type Options } from 'tsup'

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
	// silent: true,
	// esbuildOptions: (options) => {
	// 	options.logLevel = 'silent'
	// },
})

export default defineConfig([
	baseConfig({ outDir: './dist/cjs', format: ['cjs'] }),
	baseConfig({ outDir: './dist/esm', format: ['esm'] }),
	baseConfig({ outDir: './dist/types', format: ['esm'], dts: { only: true } }),
])
