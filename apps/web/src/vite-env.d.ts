/// <reference types="vite/client" />

import type { router } from './App'

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
