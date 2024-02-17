import type { CreateStorageOptions, Storage, StorageValue } from 'unstorage'
import { createStorage, prefixStorage } from 'unstorage'
import memoryDriver from 'unstorage/drivers/memory'
import { prefix } from './constant'

let storage: Storage<StorageValue> | null = null
const defaultOption: CreateStorageOptions = {
  driver: memoryDriver(),
}

let options = defaultOption

/**
 * Creates a storage with the given options.
 *
 * @param {CreateStorageOptions} opts - the options for creating the storage
 * @return {Storage} the created storage
 */
export function createStore(opts?: CreateStorageOptions) {
  if (!storage)
    storage = createStorage(opts ?? defaultOption)
  return storage
}

/**
 * Sets the options for creating storage.
 *
 * @param {CreateStorageOptions} opts - the options for creating storage
 * @return {CreateStorageOptions} the updated options
 */
export function setOptions(opts: CreateStorageOptions) {
  if (!options)
    options = opts

  return options
}

/**
 * Creates a storage with the given options and returns a storage with the prefix 'conf'.
 *
 * @param {CreateStorageOptions} opts - the options for creating the storage
 * @return {Storage} the storage with the prefix 'conf'
 */
export function confStore(opts?: CreateStorageOptions) {
  const storage = createStore(opts)
  return prefixStorage(storage, prefix.conf)
}

/**
 * Create a storage with the given options and return a prefixed storage with the 'conf' prefix.
 *
 * @param {CreateStorageOptions} opts - the options for creating the storage
 * @return {Storage} the prefixed storage with the 'conf' prefix
 */
export function envStore(opts?: CreateStorageOptions) {
  const storage = createStore(opts ?? defaultOption)
  return prefixStorage(storage, prefix.env)
}

/**
 * Creates a storage environment using the provided options and returns a prefixed storage.
 *
 * @param {CreateStorageOptions} opts - the options for creating the storage
 * @return {PrefixStorage} the prefixed storage
 */
export function ffStore(opts?: CreateStorageOptions) {
  const storage = createStore(opts ?? defaultOption)
  return prefixStorage(storage, prefix.ff)
}

/**
 * Clear the specified type of storage.
 *
 * @param {'all' | 'conf' | 'env' | 'ff'} type - The type of storage to clear
 * @return {Promise<boolean>} A promise that resolves when the storage is cleared
 */
export async function clearStorage(type: 'all' | 'conf' | 'env' | 'ff' = 'all'): Promise<boolean> {
  if (type === prefix.conf) {
    await confStore().clear()
    await confStore().dispose()
    return true
  }
  if (type === prefix.env) {
    await envStore().clear()
    await envStore().dispose()
    return true
  }
  if (type === prefix.ff) {
    await ffStore().clear()
    await ffStore().dispose()
    return true
  }
  if (type === 'all') {
    await confStore().clear()
    await confStore().dispose()
    await envStore().clear()
    await envStore().dispose()
    await ffStore().clear()
    await ffStore().dispose()
    return true
  }
  return false
}
