import { encoder } from './utils'
import { confStore, envStore, ffStore } from './store'

/**
 * Store the given key-value pair in the configuration storage.
 *
 * @param {string} key - The key for the value to be stored
 * @param {string | number | boolean | object} value - The value to be stored
 * @return {Promise<void>} A promise that resolves when the value is stored
 */
export async function setConf(key: string, value: string | number | boolean | object) {
  const confStorage = await confStore()
  return await confStorage.setItem(key, value)
}

/**
 * Store the given key-value pair in the environment storage.
 *
 * @param {string} key - The key to store the value under
 * @param {string} value - The value to be stored
 * @return {Promise<void>} A promise that resolves when the value is stored
 */
export async function setEnv(key: string, value: string) {
  const envStorage = await envStore()
  return await envStorage.setItem(key, encoder(value))
}

/**
 * Set a feature flag in the storage.
 *
 * @param {string} key - the key for the feature flag
 * @param {boolean} value - the value to set for the feature flag, defaults to true
 * @return {Promise<void>} a promise that resolves when the feature flag is set in the storage
 */
export async function setFF(key: string, value: boolean = true) {
  const ffStorage = await ffStore()
  return await ffStorage.setItem(key, value)
}
