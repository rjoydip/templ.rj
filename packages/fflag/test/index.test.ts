import { cwd } from 'node:process'
import { beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { type RCOptions, getOptions, rcOptions, readFF, setOptions, toggleFF, updateFF, writeFF } from '../src'

describe('@templ/fflag', () => {
  beforeEach(() => {
    setOptions(rcOptions)
  })
  describe('setOptions', () => {
    it('should set rcOptions to provided options object', () => {
      const options: RCOptions = {
        name: '.config',
        dir: '/path/to/dir',
        flat: false,
      }

      expect(setOptions(options)).toEqual(options)
    })

    it('should set rcOptions to default options if no argument is provided', () => {
      const options: RCOptions = {
        name: '.conf',
        dir: cwd(),
        flat: true,
      }

      expect(setOptions(options)).toEqual(options)
    })

    it('should handle partial options object as argument', () => {
      const partialOptions: Partial<RCOptions> = {
        name: '.config',
      }

      const expectedOptions: RCOptions = {
        name: '.config',
      }

      expect(setOptions(partialOptions)).toEqual(expectedOptions)
    })

    it('should handle string argument as name property', () => {
      const name: string = '.config'

      const expectedOptions: RCOptions = {
        name,
        dir: cwd(),
        flat: true,
      }

      expect(setOptions(expectedOptions)).toEqual(expectedOptions)
    })

    it('should not modify properties not present in RCOptions interface', () => {
      const options: any = {
        name: '.config',
        dir: '/path/to/dir',
        flat: false,
      }

      const expectedOptions: RCOptions = {
        name: '.config',
        dir: '/path/to/dir',
        flat: false,
      }

      expect(setOptions(options)).toEqual(expectedOptions)
    })

    it('should not add properties not present in RCOptions interface', () => {
      const options: RCOptions = {
        name: '.config',
        dir: '/path/to/dir',
        flat: false,
      }

      const expectedOptions: RCOptions = {
        name: '.config',
        dir: '/path/to/dir',
        flat: false,
      }

      expect(setOptions(options)).toEqual(expectedOptions)
    })
  })

  describe('getOptions', () => {
    beforeEach(() => {
      setOptions(rcOptions)
    })
    it('should return the options retrieved from the configuration', () => {
      const expected = {
        dir: '/path/to/dir',
        flat: false,
        name: '.config',
      }
      setOptions(expected)

      expect(getOptions()).toEqual(expected)
    })

    it('should return the default options retrieved from the configuration', () => {
      const expected = {
        name: '.conf',
        dir: cwd(),
        flat: true,
      }

      expect(getOptions()).toEqual(expected)
    })
  })
  describe('read/write/update/toggle FF', () => {
    beforeAll(() => {
      setOptions({
        name: '.conf',
        dir: cwd(),
        flat: true,
      })
    })
    it('should write property from feature flag configuration when given a valid key', async () => {
      await writeFF({ key: true })
      const result = await readFF('key')
      expect(result).toBe(true)
    })
    it('should read property from feature flag configuration when given a valid key', async () => {
      await writeFF({ key: true })
      const result = await readFF('key')
      expect(result).toBe(true)
    })
    it('should update property from feature flag configuration when given a valid key', async () => {
      const result = await updateFF({ key: false })
      expect(result).toBe(false)
    })
    it('should toggle property from feature flag configuration when given a valid key', async () => {
      const result = await readFF('key')
      const expected = await toggleFF('key')
      expect(expected).toBe(!result)
    })
  })
})
