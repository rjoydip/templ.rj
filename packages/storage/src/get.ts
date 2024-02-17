import { decoder } from './utils'
import { confStore, envStore, ffStore } from './store'

/**
 * Retrieve a configuration value from the storage.
 *
 * @param {string} key - The key of the configuration value to retrieve.
 * @return {Promise<any>} A Promise that resolves to the retrieved configuration value.
 */
export async function getConf(key: string) {
  const confStorage = await confStore()
  return await confStorage.getItem(key)
}

/**
 * Retrieves the value of the specified environment variable from the storage using the provided options.
 *
 * @param {string} key - The key of the environment variable to retrieve.
 * @return {Promise<any>} The value of the environment variable, or null if not found.
 */
export async function getEnv(key: string) {
  const envStorage = await envStore()
  const val = await envStorage.getItem<string>(key)
  return (val && decoder(val)) ?? null
}

/**
 * Retrieves an item from the storage with the given key using the specified options.
 *
 * @param {string} key - The key to retrieve the item from the storage.
 * @return {Promise<any>} A promise that resolves with the retrieved item.
 */
export async function getFF(key: string) {
  const ffStorage = await ffStore()
  return await ffStorage.getItem(key)
}
