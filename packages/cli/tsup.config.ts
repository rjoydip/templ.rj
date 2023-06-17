import { defineConfig } from 'tsup'

export default defineConfig((options) => {
  return {
    entry: ['src/cli.ts'],
    splitting: false,
    sourcemap: false,
    clean: true,
    dts: false,
    minify: !options.watch,
    format: ['esm'],
    target: 'esnext',
    platform: 'node',
  }
})
