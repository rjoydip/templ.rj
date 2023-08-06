import deepmerge from 'deepmerge'

/**
 * The `overwriteMerge` function takes two arguments, ignores the first argument, and returns the
 * second argument.
 * @param {any} _ - The underscore (_) parameter is a convention in JavaScript to indicate that the
 * parameter is not used in the function. It is often used as a placeholder when the function requires
 * a certain number of parameters but you don't need to use all of them. In this case, the function
 * does not use the first parameter
 * @param {any} sourceArray - The `sourceArray` parameter is an array that contains the values that
 * will be used to overwrite the existing values in the merge operation.
 * @returns The `sourceArray` is being returned.
 */
const overwriteMerge = (_: any, sourceArray: any) => {
  return sourceArray
}

/**
 * The `configCreator` function in TypeScript creates a configuration object by merging a default
 * configuration with a provided configuration, using a deep merge strategy.
 * @param {T} defaultConfig - The `defaultConfig` parameter is an object that represents the default
 * configuration values. It is of type `T`, which is a generic type that can be any object type.
 * @returns The function `configCreator` returns another function.
 */
export const configCreator = <T extends Record<string, any>>(
  defaultConfig: T = {} as T,
) => {
  return (
    config: T = {} as T,
    deepmergeConfig?: { arrayMerge: 'append' | 'overwrite' },
  ) => {
    return deepmerge<T>(defaultConfig, config, {
      arrayMerge:
        deepmergeConfig?.arrayMerge === 'overwrite'
          ? overwriteMerge
          : undefined,
    })
  }
}
