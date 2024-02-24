import type { ZodAny, ZodError, z } from 'zod'

export type ErrorMessage<T extends string> = T
export type Simplify<T> = {
  [P in keyof T]: T[P];
} & object

export type Impossible<T extends Record<string, any>> = Partial<
  Record<keyof T, never>
>
export type ReturnOptions<T, C, S> = Readonly<Simplify<T & C & S>>

export type ServerType = z.infer<ZodAny>
export type ClientType = z.infer<ZodAny>
export type SharedType = z.infer<ZodAny>

export interface BaseOptions<
  TShared extends SharedType,
> {
  /**
   * How to determine whether the app is running on the server or the client.
   * @default typeof window === "undefined"
   */
  isServer?: boolean

  /**
   * Shared variables, often those that are provided by build tools and is available to both client and server,
   * but isn't prefixed and doesn't require to be manually supplied. For example `NODE_ENV`, `VERCEL_URL` etc.
   */
  shared?: TShared

  /**
   * Called when validation fails. By default the error is logged,
   * and an error is thrown telling what environment variables are invalid.
   */
  onValidationError?: (error: ZodError) => never

  /**
   * Called when a server-side environment variable is accessed on the client.
   * By default an error is thrown.
   */
  onInvalidAccess?: (variable: string) => never

  /**
   * Whether to skip validation of environment variables.
   * @default false
   */
  skipValidation?: boolean

  /**
   * By default, this library will feed the environment variables directly to
   * the Zod validator.
   *
   * This means that if you have an empty string for a value that is supposed
   * to be a number (e.g. `PORT=` in a ".env" file), Zod will incorrectly flag
   * it as a type mismatch violation. Additionally, if you have an empty string
   * for a value that is supposed to be a string with a default value (e.g.
   * `DOMAIN=` in an ".env" file), the default value will never be applied.
   *
   * In order to solve these issues, we recommend that all new projects
   * explicitly specify this option as true.
   */
  emptyStringAsUndefined?: boolean
}

interface ClientOptions<
  TPrefix extends string | undefined,
  TClient extends ClientType,
> {
  /**
   * The prefix that client-side variables must have. This is enforced both at
   * a type-level and at runtime.
   */
  clientPrefix?: TPrefix

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app isn't
   * built with invalid env vars.
   */
  client: Partial<{
    [TKey in keyof TClient]: TKey extends `${TPrefix}${string}`
      ? TClient[TKey]
      : ErrorMessage<`${TKey extends string
        ? TKey
        : never} is not prefixed with ${TPrefix}.`>;
  }>
}

interface ServerOptions<
  TPrefix extends string | undefined,
  TServer extends ServerType,
> {
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app isn't
   * built with invalid env vars.
   */
  server: Partial<{
    [TKey in keyof TServer]: TPrefix extends undefined
      ? TServer[TKey]
      : TPrefix extends ''
        ? TServer[TKey]
        : TKey extends `${TPrefix}${string}`
          ? ErrorMessage<`${TKey extends `${TPrefix}${string}`
            ? TKey
            : never} should not prefixed with ${TPrefix}.`>
          : TServer[TKey];
  }>
}

export type ServerClientOptions<
  TPrefix extends string | undefined,
  TServer extends ServerType,
  TClient extends ClientType,
> =
  | (ClientOptions<TPrefix, TClient> & ServerOptions<TPrefix, TServer>)
  | (ServerOptions<TPrefix, TServer> & Impossible<ClientOptions<never, never>>)
  | (ClientOptions<TPrefix, TClient> & Impossible<ServerOptions<never, never>>)
