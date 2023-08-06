/* The code `export * from './constants'` is exporting all the named exports from the file
`constants.ts` in the current directory. This means that any other file that imports from this
module will have access to all the exported constants from `constants.ts`. */
export * from './constants'
export * from './is'
