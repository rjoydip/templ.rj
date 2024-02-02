import type { BuildOptions } from 'esbuild'
import { clean, dts } from '@templ/esbuild-plugin-templ'

export function getBuildConfig(): BuildOptions {
  return {
    entryPoints: ['src/index.ts'],
    bundle: true,
    minify: true,
    sourcemap: false,
    treeShaking: true,
    target: ['node20'],
    packages: 'external',
    format: 'esm',
    outdir: 'dist',
    plugins: [clean(), dts()],
  }
}
