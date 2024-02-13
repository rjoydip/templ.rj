import { createStorage, prefixStorage } from 'unstorage'
import type { CreateStorageOptions } from 'unstorage'
import { getStorageOption } from './option'
import { decoder, encoder } from './utils'

/**
 * Retrieves the appropriate storage based on the provided options.
 *
 * @param {CreateStorageOptions} options - The options for creating the storage.
 * @return {Storage} The selected storage.
 */
export function getStorage(options: CreateStorageOptions) {
  return createStorage(options)
}
/**
 * Retrieves the storage instance.
 *
 * @return {type} The storage instance.
 */
export function getStorageInstance(options: CreateStorageOptions) {
  return getStorage(options)
}
/**
 * Retrieves an item from the storage with the given key using the specified options.
 *
 * @param {string} key - The key to retrieve the item from the storage.
 * @param {CreateStorageOptions} opts - (Optional) The options for retrieving the item.
 * @return {Promise<any>} A promise that resolves with the retrieved item.
 */
export async function retriveFF(key: string, opts?: CreateStorageOptions) {
  const options = getStorageOption()
  const storage = getStorageInstance(options)
  const confStorage = prefixStorage(storage, encoder('ff'))
  return await confStorage.getItem(key, opts)
}
/**
 * Retrieves the value of the specified environment variable from the storage using the provided options.
 *
 * @param {string} key - The key of the environment variable to retrieve.
 * @param {CreateStorageOptions} opts - (Optional) The options to customize the retrieval process.
 * @return {Promise<any>} The value of the environment variable, or null if not found.
 */
export async function retriveEnv(key: string, opts?: CreateStorageOptions) {
  const options = getStorageOption()
  const storage = getStorageInstance(options)
  const confStorage = prefixStorage(storage, encoder('env'))
  const val = await confStorage.getItem(key, opts)
  return val && typeof val === 'string' ? decoder(String(val)) : val ?? null
}
/**
 * Retrieve a configuration value from the storage.
 *
 * @param {string} key - The key of the configuration value to retrieve.
 * @param {CreateStorageOptions} [opts] - Optional options for retrieving the configuration value.
 * @return {Promise<any>} A Promise that resolves to the retrieved configuration value.
 */
export async function retriveConf(key: string, opts?: CreateStorageOptions) {
  const options = getStorageOption()
  const storage = getStorageInstance(options)
  const confStorage = prefixStorage(storage, encoder('conf'))
  return await confStorage.getItem(key, opts)
}
