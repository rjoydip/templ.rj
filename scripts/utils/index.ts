import ora from 'ora'
import { serializeError } from 'serialize-error'

export * from './templates'
export * from './constants'

/**
 * The function `logError` logs an error message and exits the process with a failure status.
 * @param err - The `err` parameter is the error object that you want to log. It can be any type of
 * error, such as an instance of the `Error` class or a custom error object.
 */
export function logError(err) {
  const error = new Error(String(err))
  const serialized = serializeError(error)
  ora().fail(serialized.message)
  process.exit(1)
}

