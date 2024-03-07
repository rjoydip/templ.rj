import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../stories/**/*.mdx', '../registry/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@geometricpanda/storybook-addon-badges',
    '@storybook/addon-essentials',
    // '@storybook/addon-interactions',
    '@storybook/addon-links',
    '@storybook/addon-storysource',
    'storybook-dark-mode',
    'storybook-addon-performance',
    'storybook-addon-pseudo-states',
  ],
  framework: '@storybook/react-vite',
}
export default config
