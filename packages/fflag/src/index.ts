import { cwd } from 'node:process'
import { read, update, write } from 'rc9'

type RC = Record<string, boolean>

export interface RCOptions {
  name?: string
  dir?: string
  flat?: boolean
}

let options: RCOptions = {
  name: '.conf',
  dir: cwd(),
  flat: true,
}

export const rcOptions = options

/**
 * Set options based on the provided input.
 *
 * @param {RCOptions} opts - the options to be set
 */
export function setOptions(opts: RCOptions) {
  options = opts
  return options
}
/**
 * Retrieves the options from the configuration.
 *
 * @return {any} The options retrieved from the configuration.
 */
export function getOptions() {
  return options
}
/**
 * Read a property from the feature flag configuration.
 *
 * @param {string} key - the key of the property to read
 * @return {any} the value of the property
 */
export async function readFF(key?: string): Promise<boolean> {
  if (key) {
    const ff = await read(options)
    return typeof ff[key] === 'boolean' ? ff[key] : false
  }
  else {
    return false
  }
}
/**
 * Writes the given key with the specified RC options.
 *
 * @param {RC} key - the key to be written
 * @return {Promise<void>} a promise that resolves after the write operation is completed
 */
export async function writeFF(key: RC) {
  return await write(key, rcOptions)
}
/**
 * Update the FF with the given key using the specified RC options.
 *
 * @param {RC} key - The key to identify the FF to be updated
 * @return {Promise<any>} A promise that resolves with the result of the update operation
 */
export async function updateFF(key: RC): Promise<boolean> {
  await update(key, rcOptions)
  return await readFF(Object.keys(key)[0])
}

export async function toggleFF(key: string): Promise<boolean> {
  const r = await readFF(key)
  return await updateFF({ key: !r })
}
