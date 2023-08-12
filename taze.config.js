import { defineConfig } from 'taze'

export default defineConfig({
  exclude: [],
  force: true,
  write: true,
  install: true,
  packageMode: {},
  ignorePaths: ['third_party/**'],
})
