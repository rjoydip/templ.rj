/**
 * The function `isDefined` checks if a value is not undefined or null.
 * @param {T | undefined | null} value - The `value` parameter is a generic type `T` that can be any
 * type, including `undefined` or `null`.
 */
export const isDefined = <T>(
  value: T | undefined | null,
): value is NonNullable<T> => value !== undefined && value !== null

/**
 * The function checks if a value is undefined or null.
 * @param {T | undefined | null} value - The `value` parameter is a generic type `T` that can be any
 * type. It can be a value of type `T`, `undefined`, or `null`.
 */
export const isNotDefined = <T>(
  value: T | undefined | null,
): value is undefined | null => value === undefined || value === null

/**
 * The `isEmpty` function checks if a value is undefined, null, or an empty string.
 * @param {string | undefined | null} value - The `value` parameter is of type `string | undefined |
 * null`, which means it can be a string, undefined, or null.
 */
export const isEmpty = (value: string | undefined | null): value is undefined =>
  value === undefined || value === null || value === ''

/**
 * The function checks if a value is not empty, meaning it is not undefined, null, or an empty string.
 * @param {string | undefined | null} value - The parameter "value" is of type string or undefined or
 * null.
 */
export const isNotEmpty = (value: string | undefined | null): value is string =>
  value !== undefined && value !== null && value !== ''
