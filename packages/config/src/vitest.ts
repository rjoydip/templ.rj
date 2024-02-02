export function getVitestConfig() {
  return {
    test: {
      include: ['test/**/*.test.ts'],
      coverage: {
        enabled: true,
        reporter: ['text', 'json', 'html'],
      },
    },
  }
}
