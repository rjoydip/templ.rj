import { z } from 'zod'
import type { ZodError } from 'zod'
import { isTest } from 'std-env'
import type { BaseOptions, ClientType, ReturnOptions, ServerClientOptions, ServerType, SharedType } from '../types'

interface LooseOptions<
  TShared extends SharedType,
> extends BaseOptions<TShared> {
  runtimeConf: Record<string, string | boolean | number | undefined>
}

interface StrictOptions<
  TShared extends SharedType,
> extends BaseOptions<TShared> {
  runtimeConf?: never
}

type ConfOptions<
  TPrefix extends string | undefined,
  TServer extends ServerType,
  TClient extends ClientType,
  TShared extends SharedType,
> =
  | (LooseOptions<TShared> &
    ServerClientOptions<TPrefix, TServer, TClient>)
  | (StrictOptions<TShared> &
    ServerClientOptions<TPrefix, TServer, TClient>)

export function createConf<
  TPrefix extends string | undefined,
  TServer extends ServerType,
  TClient extends ClientType,
  TShared extends SharedType,
>(
  opts: ConfOptions<TPrefix, TServer, TClient, TShared>,
): ReturnOptions<TServer, TClient, TShared> {
  const client = z.object(opts.client && typeof opts.client === 'object' ? opts.client : {})
  const shared = z.object(opts.shared && typeof opts.shared === 'object' ? opts.shared : {})

  const isServer = opts.isServer ?? typeof window === 'undefined'

  const parsed = isServer
    ? z.object(opts.server && typeof opts.server === 'object'
      ? opts.server
      : {}).merge(shared).merge(client).safeParse(opts.runtimeConf)
    : client.merge(shared).safeParse(opts.runtimeConf)

  const onValidationError
    = opts.onValidationError
    ?? ((error: ZodError) => {
      if (!isTest) {
        console.error(
          '❌ Invalid config variables:',
          error.flatten().fieldErrors,
        )
      }
      throw new Error('Invalid config variables')
    })

  const onInvalidAccess
    = opts.onInvalidAccess
    ?? ((_variable: string) => {
      throw new Error(
        '❌ Attempted to access a server-side config variable on the client',
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

  const $conf = new Proxy(parsed.data, {
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

  return $conf as ReturnOptions<TServer, TClient, TShared>
}
