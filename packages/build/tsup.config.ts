import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  splitting: false,
  sourcemap: false,
  clean: true,
  dts: true,
  minify: true,
  target: 'esnext',
  format: ['esm'],
  platform: 'node',
})
