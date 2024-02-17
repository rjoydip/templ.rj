const configShared = {
  test: {
    include: ['{test,tests}/**/*.test.{ts,js}'],
    exclude: ['esbuild.config.ts*'],
    coverage: {
      enabled: true,
      reporter: ['text', 'json', 'html'],
    },
  },
}

export default configShared
