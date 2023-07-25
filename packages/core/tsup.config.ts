import { tsupConfig } from '@gfft/config'

export default tsupConfig({
  banner: {
    js: `import { createRequire } from 'module';const require = createRequire(import.meta.url);`,
  },
})
