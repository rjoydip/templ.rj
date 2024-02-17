import { afterEach, describe, expect, it } from 'vitest'
import { getConf, getEnv, getFF, setConf, setEnv, setFF } from '../src'
import { clearStorage } from '../src/store'

describe('@templ/storage > get & set', () => {
  const key = 'foorbar'
  const value = 'foobar'

  afterEach(async () => {
    await clearStorage()
  })

  describe('getConf', () => {
    it('should retrieve an available item of value string from storage with the given key', async () => {
      await setConf(key, value)
      const result = await getConf(key)
      expect(result).toBeTypeOf('string')
      expect(result).toStrictEqual(value)
    })

    it('should retrieve an available item of value boolean from storage with the given key', async () => {
      await setConf(key, true)
      const resultTruthy = await getConf(key)
      expect(resultTruthy).toBeTypeOf('boolean')
      expect(resultTruthy).toBeTruthy()

      await setConf(key, false)
      const resultFalsy = await getConf(key)
      expect(resultFalsy).toBeTypeOf('boolean')
      expect(resultFalsy).toBeFalsy()
    })

    it('should retrieve an available item of value number from storage with the given key', async () => {
      await setConf(key, 1)
      const result = await getConf(key)
      expect(result).toBeTypeOf('number')
      expect(result).toBe(1)
    })

    it('should retrieve an available item of value object from storage with the given key', async () => {
      const value = { a: 1 }
      await setConf(key, value)
      const result = await getConf(key)
      expect(result).toBeTypeOf('object')
      expect(result).toStrictEqual(value)
    })

    it('should retrieve an available item of value Array from storage with the given key', async () => {
      const value = [{ a: 1 }, { b: 2 }, { c: 3 }]
      await setConf(key, value)
      const result = await getConf(key)
      expect(result).toBeTypeOf('object')
      expect(result).toStrictEqual(value)
    })

    it('should retrieve an nonavailable item from storage with the given key', async () => {
      const result = await getConf(`${key}foo`)
      expect(result).toBe(null)
    })
  })

  describe('geteEnv', () => {
    it('should retrieve an available item of value from storage with the given key', async () => {
      await setEnv(key, value)
      const result = await getEnv(key)
      expect(result).toBeTypeOf('string')
      expect(result).toStrictEqual(value)
    })

    it('should retrieve an nonavailable item from storage with the given key', async () => {
      const result = await getEnv(`${key}foo`)
      expect(result).toBe(null)
    })
  })

  describe('geteFF', () => {
    it('should retrieve an available item of value true from storage with the given key', async () => {
      await setFF(key, true)
      const result = await getFF(key)
      expect(result).toBeTruthy()
    })

    it('should retrieve an available item of value false from storage with the given key', async () => {
      await setFF(key, false)
      const result = await getFF(key)
      expect(result).toBeFalsy()
    })

    it('should retrieve an available item of value without value from storage with the given key', async () => {
      await setFF(key)
      const result = await getFF(key)
      expect(result).toBeTruthy()
    })

    it('should retrieve an unset item from storage with the given key', async () => {
      const result = await getFF(key)
      expect(result).toBeNull()
    })

    it('should retrieve an nonavailable item from storage with the given key', async () => {
      const result = await getFF(`${key}foo`)
      expect(result).toBeFalsy()
    })
  })
})
