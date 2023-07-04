import { defineConfig } from 'tsup'

export default defineConfig((options) => {
  return {
    entry: ['src/index.ts'],
    splitting: true,
    sourcemap: false,
    clean: true,
    dts: true,
    minify: !options.watch,
    format: ['cjs', 'esm'],
    target: 'esnext',
    platform: 'node',
  }
})
