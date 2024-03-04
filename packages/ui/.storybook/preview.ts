import { HIGHLIGHT } from '@storybook/addon-highlight'
import { useChannel } from '@storybook/preview-api'
import type { Preview } from '@storybook/react'
import { themes } from '@storybook/theming'
import { withPerformance } from 'storybook-addon-performance'

import '../styles/global.css'

export const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    a11y: {
      // Optional selector to inspect
      element: '#storybook-root',
      config: {
        rules: [
          {
            // The autocomplete rule will not run based on the CSS selector provided
            id: 'autocomplete-valid',
            selector: '*:not([autocomplete="nope"])',
          },
          {
            // Setting the enabled option to false will disable checks for this particular rule on all stories.
            id: 'image-alt',
            enabled: false,
          },
        ],
      },
      // Axe's options parameter
      options: {},
      // Optional flag to prevent the automatic check
      manual: true,
    },
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
