import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import ora from 'ora'
import { serializeError } from 'serialize-error'

export * from './templates'

export const STARTED = 'STARTED'
export const COMPLETED = 'COMPLETED'

/**
 * The function `logError` logs an error message and exits the process with a failure status.
 * @param err - The `err` parameter is the error object that you want to log. It can be any type of
 * error, such as an instance of the `Error` class or a custom error object.
 */
export function logError(err: any) {
  const error = new Error(err instanceof Error ? String(err) : err)
  const serialized = serializeError(error)
  ora().fail(serialized.message)
  process.exit(1)
}

export const root = resolve(fileURLToPath(import.meta.url), '../../../../')
export const pkgRoot = resolve(root, 'packages')
