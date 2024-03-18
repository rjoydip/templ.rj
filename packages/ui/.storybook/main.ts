import { dirname, join } from 'node:path'
import type { StorybookConfig } from '@storybook/react-vite'

function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, 'package.json')))
}

const config: StorybookConfig = {
  stories: ['../registry/**/*.stories.@(js|jsx|mjs|ts|tsx)'], // '../stories/**/*.mdx',

  addons: [
    getAbsolutePath('@geometricpanda/storybook-addon-badges'),
    getAbsolutePath('@storybook/addon-essentials'),
    getAbsolutePath('@storybook/addon-links'),
    getAbsolutePath('@storybook/addon-storysource'),
    getAbsolutePath('storybook-dark-mode'),
  ],

  framework: getAbsolutePath('@storybook/react-vite'),

  docs: {
    autodocs: false,
  },
}
export default config
