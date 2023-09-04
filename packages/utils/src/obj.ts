// Original https://github.com/sindresorhus/filter-obj/blob/main/index.js

export function includeKeys<T extends Record<string, any>>(
  object: T,
  predicate: (key: string, value: any, object: T) => boolean | string[],
): Partial<T> {
  const result: Partial<T> = {}

  if (Array.isArray(predicate)) {
    for (const key of predicate) {
      const descriptor = Object.getOwnPropertyDescriptor(object, key)
      if (descriptor?.enumerable) {
        Object.defineProperty(result, key, descriptor)
      }
    }
  } else {
    // `Reflect.ownKeys()` is required to retrieve symbol properties
    for (const key of Reflect.ownKeys(object)) {
      const descriptor = Object.getOwnPropertyDescriptor(object, key)
      if (descriptor?.enumerable) {
        const value = object[key as string]
        if (predicate(key as string, value, object)) {
          Object.defineProperty(result, key, descriptor)
        }
      }
    }
  }

  return result
}

export function excludeKeys<T extends Record<string, any>>(
  object: T,
  predicate: (key: string, value: any, object: T) => boolean | string[],
): Partial<T> {
  if (Array.isArray(predicate)) {
    const set = new Set(predicate)
    return includeKeys(object, (key) => !set.has(key))
  }

  return includeKeys(object, (key, value, obj) => !predicate(key, value, obj))
}
