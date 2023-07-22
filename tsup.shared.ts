export const config = {
  entry: ['src/index.ts'],
  splitting: false,
  sourcemap: false,
  clean: true,
  dts: true,
  target: 'esnext',
  format: ['cjs', 'esm'],
}
