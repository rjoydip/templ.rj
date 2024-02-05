const configShared = {
  test: {
    include: ['test/**/*.test.ts'],
    coverage: {
      enabled: true,
      reporter: ['text', 'json', 'html'],
    },
  },
}

export default configShared
