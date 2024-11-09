import { env, isTest } from 'std-env'
import { z } from 'zod'
import type { ZodError } from 'zod'
import type { BaseOptions, ClientType, ReturnOptions, ServerClientOptions, ServerType, SharedType } from '../types'

interface LooseOptions<
  TShared extends SharedType,
> extends BaseOptions<TShared> {
  runtimeEnvStrict?: never
  /**
   * What object holds the environment variables at runtime. This is usually
   * `process.env` or `import.meta.env`.
   */
  // Unlike `runtimeEnvStrict`, this doesn't enforce that all environment variables are set.
  runtimeEnv: Record<string, string | boolean | number | undefined>
}

interface StrictOptions<
  TPrefix extends string | undefined,
  TServer extends ServerType,
  TClient extends ClientType,
  TShared extends SharedType,
> extends BaseOptions<TShared> {
  /**
   * Runtime Environment variables to use for validation - `process.env`, `import.meta.env` or similar.
   * Enforces all environment variables to be set. Required in for example Next.js Edge and Client runtimes.
   */
  runtimeEnvStrict: Record<
    | {
      [TKey in keyof TClient]: TPrefix extends undefined
        ? never
        : TKey extends `${TPrefix}${string}`
          ? TKey
          : never;
    }[keyof TClient]
    | {
      [TKey in keyof TServer]: TPrefix extends undefined
        ? TKey
        : TKey extends `${TPrefix}${string}`
          ? never
          : TKey;
    }[keyof TServer]
    | {
      [TKey in keyof TShared]: TKey extends string ? TKey : never;
    }[keyof TShared],
    string | boolean | number | undefined
  >
  runtimeEnv?: never
}

type EnvOptions<
  TPrefix extends string | undefined,
  TServer extends ServerType,
  TClient extends ClientType,
  TShared extends SharedType,
> =
  | (LooseOptions<TShared> &
    ServerClientOptions<TPrefix, TServer, TClient>)
  | (StrictOptions<TPrefix, TServer, TClient, TShared> &
    ServerClientOptions<TPrefix, TServer, TClient>)

export function createEnv<
  TPrefix extends string | undefined,
  TServer extends ServerType,
  TClient extends ClientType,
  TShared extends SharedType,
>(
  opts: EnvOptions<TPrefix, TServer, TClient, TShared>,
): ReturnOptions<TServer, TClient, TShared> {
  const runtimeEnv = opts.runtimeEnvStrict ?? opts.runtimeEnv ?? env

  const emptyStringAsUndefined = opts.emptyStringAsUndefined ?? false
  if (emptyStringAsUndefined) {
    for (const [key, value] of Object.entries(runtimeEnv)) {
      if (value === '')
        delete runtimeEnv[key]
    }
  }

  const skip = !!opts.skipValidation
  if (skip)
    return runtimeEnv as any

  const client = z.object(opts.client && typeof opts.client === 'object' ? opts.client : {})
  const shared = z.object(opts.shared && typeof opts.shared === 'object' ? opts.shared : {})

  const isServer = opts.isServer ?? typeof window === 'undefined'

  const parsed = isServer
    ? z.object(opts.server && typeof opts.server === 'object'
      ? opts.server
      : {}).merge(shared).merge(client).safeParse(runtimeEnv)
    : client.merge(shared).safeParse(runtimeEnv)

  const onValidationError
    = opts.onValidationError
    ?? ((error: ZodError) => {
      if (!isTest) {
        console.error(
          '❌ Invalid environment variables:',
          error.flatten().fieldErrors,
        )
      }
      throw new Error('Invalid environment variables')
    })

  const onInvalidAccess
    = opts.onInvalidAccess
    ?? ((_variable: string) => {
      throw new Error(
        '❌ Attempted to access a server-side environment variable on the client',
      )
    })

  if (parsed.success === false)
    return onValidationError(parsed.error)

  const isServerAccess = (prop: string) => {
    if (!opts.clientPrefix)
      return true
    return !prop.startsWith(opts.clientPrefix) && !(prop in shared.shape)
  }
  const isValidServerAccess = (prop: string) => {
    return isServer || !isServerAccess(prop)
  }
  const ignoreProp = (prop: string) => {
    return prop === '__esModule' || prop === '$$typeof'
  }

  const $env = new Proxy(parsed.data, {
    get(target, prop) {
      if (typeof prop !== 'string')
        return undefined
      if (ignoreProp(prop))
        return undefined
      if (!isValidServerAccess(prop))
        return onInvalidAccess(prop)
      return Reflect.get(target, prop)
    },
  })

  return $env as ReturnOptions<TServer, TClient, TShared>
}
