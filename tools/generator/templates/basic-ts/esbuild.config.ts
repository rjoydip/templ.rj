import * as esbuild from 'esbuild'

await esbuild.build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  minify: true,
  sourcemap: false,
  treeShaking: true,
  target: ['node20'],
  packages: 'external',
  format: 'esm',
  outfile: 'dist/index.js',
})
