import type { CreateStorageOptions } from 'unstorage'
import memoryDriver from 'unstorage/drivers/memory'

let options: CreateStorageOptions = {
  driver: memoryDriver(),
}

/**
 * Set the store option with the given options.
 *
 * @param {CreateStorageOptions} opts - the options to set the store with
 * @return {CreateStorageOptions} the store options
 */
export function setStorageOption(opts: CreateStorageOptions) {
  options = opts
  return options
}
/**
 * Get the storage option.
 *
 * @return {type} description of return value
 */
export function getStorageOption() {
  return options
}
