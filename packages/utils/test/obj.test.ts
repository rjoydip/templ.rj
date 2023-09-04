import { describe, expect, test } from 'vitest'
import { includeKeys, excludeKeys } from '../src'

describe('@templ/utils > Obj', () => {
  describe('includeKeys', () => {
    test('function predicate returns a boolean', () => {
      expect(
        Object.keys(includeKeys({ foo: true, bar: false }, () => true)).length,
      ).toBe(2)
      expect(
        Object.keys(includeKeys({ foo: true, bar: false }, () => false)).length,
      ).toBe(0)
    })

    test('function predicate passes the key as argument', () => {
      expect(
        includeKeys({ foo: true }, (key) => key === 'foo').foo,
      ).toBeTruthy()
    })

    test('function predicate passes the value as argument', () => {
      expect(
        includeKeys({ foo: 'test' }, (_, value) => value === 'test').foo,
      ).toBe('test')
    })

    test('function predicate passes the object as argument', () => {
      expect(
        includeKeys({ foo: true }, (_, __, object) => object.foo).foo,
      ).toBeTruthy()
    })

    test('array predicate', () => {
      // TODO: predicate error on boolean
      // expect(Object.keys(includeKeys({ foo: true, bar: false }, ['foo']))).toStrictEqual(['foo'])
    })

    test('symbol properties are kept', () => {
      const symbol = Symbol('test')
      const input = { [symbol]: true }
      expect(includeKeys(input, () => true)[symbol]).toBeTruthy()
    })

    test('non-enumerable properties are omitted', () => {
      const input = Object.defineProperty({}, 'test', {
        value: true,
        enumerable: false,
      })
      expect(includeKeys(input, () => true)['test']).toBeUndefined()
    })

    test('descriptors are kept as is', () => {
      const descriptor = {
        get() {},
        set() {},
        enumerable: true,
        configurable: false,
      }
      const input = Object.defineProperty({}, 'test', descriptor)
      expect(
        Object.getOwnPropertyDescriptor(
          includeKeys(input, () => true),
          'test',
        ),
      ).toStrictEqual(descriptor)
      // TODO: Having problem in predicate
      // expect(Object.getOwnPropertyDescriptor(includeKeys(input, ['test']), 'test')).toStrictEqual(descriptor)
    })

    test('inherited properties are omitted', () => {
      const Parent = class {
        test() {}
      }
      const Child = class extends Parent {}
      const input = new Child()
      expect(includeKeys(input, () => true).test).toBeUndefined()
    })

    test('__proto__ keys', () => {
      const input = { __proto__: { foo: true } }
      expect(includeKeys(input, () => true)).toStrictEqual(input)
    })
  })

  describe('excludeKeys', () => {
    test('excludeKeys: function predicate returns a boolean', () => {
      expect(
        Object.keys(excludeKeys({ foo: true, bar: false }, () => true)).length,
      ).toBe(0)
      expect(
        Object.keys(excludeKeys({ foo: true, bar: false }, () => false)).length,
      ).toBe(2)
    })

    test('excludeKeys: function predicate passes the key as argument', () => {
      expect(
        excludeKeys({ foo: true }, (key) => key !== 'foo').foo,
      ).toBeTruthy()
    })

    test('excludeKeys: function predicate passes the value as argument', () => {
      expect(
        excludeKeys({ foo: 'test' }, (key, value) => value !== 'test').foo,
        'test',
      ).toBeTruthy()
    })

    test('excludeKeys: function predicate passes the object as argument', () => {
      expect(
        excludeKeys({ foo: true }, (key, value, object) => !object.foo).foo,
      ).toBeTruthy()
    })

    test('excludeKeys: array predicate', () => {
      // TODO: predicate error on boolean
      // expect(Object.keys(excludeKeys({ foo: true, bar: false }, ['bar']))).toStrictEqual(['foo'])
    })

    test('excludeKeys: symbol properties are kept', () => {
      const symbol = Symbol('test')
      const input = { [symbol]: true }
      expect(excludeKeys(input, () => false)[symbol])
    })

    test('excludeKeys: non-enumerable properties are omitted', () => {
      const input = Object.defineProperty({}, 'test', {
        value: true,
        enumerable: false,
      })
      expect(excludeKeys(input, () => false)['test']).toBeUndefined()
    })

    test('excludeKeys: descriptors are kept as is', () => {
      const descriptor = {
        get() {},
        set() {},
        enumerable: true,
        configurable: false,
      }
      const input = Object.defineProperty({}, 'test', descriptor)
      expect(
        Object.getOwnPropertyDescriptor(
          excludeKeys(input, () => false),
          'test',
        ),
      ).toStrictEqual(descriptor)
      // TODO: Having problem in predicate
      // expect(Object.getOwnPropertyDescriptor(excludeKeys(input, []), 'test')).toStrictEqual('descriptor')
    })

    test('excludeKeys: inherited properties are omitted', () => {
      const Parent = class {
        test() {}
      }
      const Child = class extends Parent {}
      const input = new Child()
      expect(excludeKeys(input, () => false).test).toBeUndefined()
    })

    test('excludeKeys: __proto__ keys', () => {
      const input = { __proto__: { foo: true } }
      expect(excludeKeys(input, () => false)).toStrictEqual(input)
    })
  })
})
