import { z } from 'zod'

export const envSchema = {
  server: {
    DATABASE_URL: z.string().default(''),
    /**
     * The API key of your OpenAI account.
     * @default ''
     *
     * @example
     * ```bash
     * OPEN_AI_API_KEY=... node ./index.mjs
     * ```
     * @description
     * This is used to set the `OPEN_AI_API_KEY` environment variable.
     * @see https://platform.openai.com/account/api-keys
     */
    OPEN_AI_API_KEY: z.string().optional().default(''),
  },
  client: {},
  shared: {/* */},
}
