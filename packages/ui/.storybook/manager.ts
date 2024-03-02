import { addons } from '@storybook/manager-api'
import { create } from '@storybook/theming'

addons.setConfig({
  toolbar: {
    'storybook/background': { hidden: true },
  },
  theme: create({
    base: 'light',
    brandTitle: 'Templ',
    colorSecondary: '#1EA7FD',
  }),
})
