import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: (string | boolean | string[] | undefined)[]) {
  return twMerge(clsx(inputs))
}
