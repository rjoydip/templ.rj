import { tsupConfig } from './src'

/* The line `export default tsupConfig({})` is exporting the result of calling the `tsupConfig`
function with an empty object as its argument. The `tsupConfig` function likely returns a
configuration object that is used to configure the `tsup` bundler. By exporting it as the default
export, it can be imported and used in other parts of the codebase. */
export default tsupConfig({})
