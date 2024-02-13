import { type CreateStorageOptions, prefixStorage } from 'unstorage'
import { getStorageInstance } from './get'
import { getStorageOption } from './option'
import { encoder } from './utils'

/**
 * Asynchronously stores the given key-value pair in the storage with the option to provide additional storage options.
 *
 * @param {string} key - The key to store the value under
 * @param {boolean} value - The value to be stored
 * @param {CreateStorageOptions} [opts] - Additional storage options
 * @return {Promise<void>} A Promise that resolves when the key-value pair is successfully stored
 */
export async function storeFF(key: string, value: boolean, opts?: CreateStorageOptions) {
  const options = getStorageOption()
  const storage = getStorageInstance(options)
  const ffStorage = prefixStorage(storage, encoder('ff'))
  return await ffStorage.setItem(key, value, opts)
}
/**
 * Store the given key-value pair in the environment storage.
 *
 * @param {string} key - The key to store the value under
 * @param {string} value - The value to be stored
 * @param {CreateStorageOptions} [opts] - Optional storage options
 * @return {Promise<void>} A promise that resolves when the value is stored
 */
export async function storeEnv(key: string, value: string, opts?: CreateStorageOptions) {
  const options = getStorageOption()
  const storage = getStorageInstance(options)
  const envStorage = prefixStorage(storage, encoder('env'))
  return await envStorage.setItem(key, encoder(value), opts)
}
/**
 * Store the given key-value pair in the configuration storage.
 *
 * @param {string} key - The key for the value to be stored
 * @param {string} value - The value to be stored
 * @param {CreateStorageOptions} [opts] - Optional storage options
 * @return {Promise<void>} A promise that resolves when the value is stored
 */
export async function storeConf(key: string, value: string, opts?: CreateStorageOptions) {
  const options = getStorageOption()
  const storage = getStorageInstance(options)
  const confStorage = prefixStorage(storage, encoder('conf'))
  return await confStorage.setItem(key, value, opts)
}
