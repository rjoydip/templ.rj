/**
 * The function `isDefined` checks if a value is not undefined or null.
 * @param value - The `value` parameter is a generic type `T` that can be any
 * type, including `undefined` or `null`.
 */
export function isDefined<T>(value: T | undefined | null): value is NonNullable<T> {
  return value !== undefined && value !== null
}

/**
 * The function checks if a value is undefined or null.
 * @param value - The `value` parameter is a generic type `T` that can be any
 * type. It can be a value of type `T`, `undefined`, or `null`.
 */
export function isNotDefined<T>(value: T | undefined | null): value is undefined | null {
  return value === undefined || value === null
}

/**
 * The `isEmpty` function checks if a value is undefined, null, or an empty string.
 * @param value - The `value` parameter is of type `string | undefined |
 * null`, which means it can be a string, undefined, or null.
 */
export function isEmpty(value: string | undefined | null): value is undefined {
  return value === undefined || value === null || value === ''
}

/**
 * The function checks if a value is not empty, meaning it is not undefined, null, or an empty string.
 * @param value - The parameter "value" is of type string or undefined or
 * null.
 */
export function isNotEmpty(value: string | undefined | null): value is string {
  return value !== undefined && value !== null && value !== ''
}
