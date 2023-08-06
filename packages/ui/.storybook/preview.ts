import type { Preview } from '@storybook/preact'

/* The code is defining a constant variable `preview` of type `Preview`. `Preview` is likely a
type/interface defined in the `@storybook/preact` library. */
const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
}

export default preview
