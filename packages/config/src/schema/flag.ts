import { z } from 'zod'

export const flagSchema = {
  client: {
    HEADER: z.boolean().optional().default(false),
  },
  package: {/* */},
  server: {
    HTTPS: z.boolean().optional().default(false),
  },
  shared: {/* */},
}
