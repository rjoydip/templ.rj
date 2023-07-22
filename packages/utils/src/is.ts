import { existsSync } from 'node:fs'

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

export const isString = (str: string): boolean => /^\{\{.*\}\}$/.test(str)

export function isJSONFile(filename: string) {
  return !!filename.endsWith('.json')
}

export function isMarkdownFile(filename: string) {
  return !!filename.endsWith('.md')
}

export function isMarkdownTemplateFile(filename: string) {
  return !!filename.endsWith('.tmpl.md')
}

export function isDataDirectoryExists(directory: string) {
  return existsSync(directory)
}

export function isOutputDirectoryExists(directory: string) {
  return existsSync(directory)
}

export function isTemplateDirectoryExists(directory: string) {
  return existsSync(directory)
}
