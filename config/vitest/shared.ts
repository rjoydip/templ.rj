const configShared = {
  test: {
    include: ['{test,tests}/**/*.test.{ts,js}'],
    coverage: {
      enabled: true,
      reporter: ['text', 'json', 'html'],
    },
  },
}

export default configShared
