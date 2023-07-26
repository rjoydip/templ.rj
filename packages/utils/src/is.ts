export const isDefined = <T>(
  value: T | undefined | null,
): value is NonNullable<T> => value !== undefined && value !== null

export const isNotDefined = <T>(
  value: T | undefined | null,
): value is undefined | null => value === undefined || value === null

export const isEmpty = (value: string | undefined | null): value is undefined =>
  value === undefined || value === null || value === ''

export const isNotEmpty = (value: string | undefined | null): value is string =>
  value !== undefined && value !== null && value !== ''
