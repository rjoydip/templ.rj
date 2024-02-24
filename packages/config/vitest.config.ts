import { defineProject } from 'vitest/config'

export default defineProject({
  test: {
    include: ['{test,tests}/**/*.test.{ts,js}'],
  },
})
