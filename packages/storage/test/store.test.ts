import memoryDriver from 'unstorage/drivers/memory'
import { describe, expect, expectTypeOf, it } from 'vitest'
import type { CreateStorageOptions } from 'unstorage'
import { clearStorage, confStore, createStore, envStore, ffStore, setOptions } from '../src/store'

describe('@templ/storage > store', () => {
  describe('createStore', () => {
    it('should create a storage with default options when no options are provided', () => {
      const result = createStore()
      expect(result).toBeDefined()
    })
    // should create a storage with provided options
    it('should create a storage with provided options', () => {
      const options: CreateStorageOptions = {
        driver: memoryDriver(),
      }
      const result = createStore(options)
      expect(result).toBeDefined()
    })
    // should return the same storage instance if called multiple times without options
    it('should return the same storage instance if called multiple times without options', () => {
      const result1 = createStore()
      const result2 = createStore()
      expect(result1).toBeDefined()
      expect(result2).toBeDefined()
      expect(result1).toBe(result2)
    })
    // should create a storage with empty options object
    it('should create a storage with empty options object', () => {
      const options: CreateStorageOptions = {}
      const result = createStore(options)
      expect(result).toBeDefined()
    })
    // should create a storage with invalid options object
    it('should create a storage with invalid options object', () => {
      const options: CreateStorageOptions = {
        driver: null as any,
      }
      const result = createStore(options)
      expect(result).toBeDefined()
    })
    // should create a storage with null options
    it('should create a storage with null options', () => {
      const options: CreateStorageOptions = null as any
      const result = createStore(options)
      expect(result).toBeDefined()
    })
  })
  it('should be valid setOptions', () => {
    expect(setOptions({
      driver: memoryDriver(),
    })).toBeDefined()
    expectTypeOf(setOptions).parameter(0).toBeObject()
  })

  it('should return a storage object for \'conf\'', () => {
    expect(confStore()).toBeDefined()
    const storage = confStore({
      driver: memoryDriver(),
    })
    expect(storage).toBeDefined()
    storage.setItem('key', 'value')
    expect(() => storage.getItem('key')).not.throw()
  })
  it('should return a storage object for \'env\'', () => {
    expect(envStore()).toBeDefined()
    const storage = envStore({
      driver: memoryDriver(),
    })
    expect(storage).toBeDefined()
    storage.setItem('key', 'value')
    expect(() => storage.getItem('key')).not.throw()
  })
  it('should return a storage object for \'ff\'', () => {
    expect(ffStore()).toBeDefined()
    const storage = ffStore({
      driver: memoryDriver(),
    })
    expect(storage).toBeDefined()
    storage.setItem('key', 'value')
    expect(() => storage.getItem('key')).not.throw()
  })

  describe('clearStorage', () => {
    it('should clear storage when type is \'conf\'', async () => {
      const isCleaned = await clearStorage('conf')
      expect(isCleaned).toBeTruthy()
    })
    it('should clear storage when type is \'env\'', async () => {
      const isCleaned = await clearStorage('env')
      expect(isCleaned).toBeTruthy()
    })
    it('should clear storage when type is \'ff\'', async () => {
      const isCleaned = await clearStorage('ff')
      expect(isCleaned).toBeTruthy()
    })
    it('should clear storage when type is \'all\'', async () => {
      const isCleaned = await clearStorage('all')
      expect(isCleaned).toBeTruthy()
    })
    it('should clear storage when type is \'invalid\'', async () => {
      const isCleaned = await clearStorage('invalid' as any)
      expect(isCleaned).toBeFalsy()
    })
  })
})
