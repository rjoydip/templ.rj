import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../stories/**/*.mdx', '../modules/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@geometricpanda/storybook-addon-badges',
    '@storybook/addon-essentials',
    '@storybook/addon-links',
    '@storybook/addon-storysource',
    'storybook-dark-mode',
  ],
  framework: '@storybook/react-vite',
  docs: {
    autodocs: false,
  },
}
export default config
