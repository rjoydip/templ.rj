import type { StorybookConfig } from '@storybook/preact-vite'

const config: StorybookConfig = {
  stories: ['../stories/**/*.mdx', '../stories/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-coverage',
    '@storybook/addon-storysource',
  ],
  framework: {
    name: '@storybook/preact-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
}
export default config
