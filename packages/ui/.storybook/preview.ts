import { HIGHLIGHT } from '@storybook/addon-highlight'
import { useChannel } from '@storybook/preview-api'
import type { Preview } from '@storybook/react'
import { themes } from '@storybook/theming'
import { withPerformance } from 'storybook-addon-performance'

import '../styles/global.css'

export const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    darkMode: {
      current: 'light',
      dark: { ...themes.dark },
      light: { ...themes.light },
    },
  },
  decorators: [
    withPerformance,
    (storyFn) => {
      const emit = useChannel({})
      emit(HIGHLIGHT, {
        elements: ['.title', '.subtitle'],
        color: 'red',
        style: 'solid', // 'dotted' | 'dashed' | 'solid' | 'double'
      })
      return storyFn()
    },
  ],
}
