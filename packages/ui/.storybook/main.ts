import type { StorybookConfig } from '@storybook/react-vite'
import { mergeConfig } from 'vite'

const config: StorybookConfig = {
  stories: ['../stories/**/*.mdx', '../registry/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@geometricpanda/storybook-addon-badges',
    '@storybook/addon-a11y',
    '@storybook/addon-coverage',
    '@storybook/addon-essentials',
    // '@storybook/addon-interactions',
    '@storybook/addon-links',
    '@storybook/addon-storysource',
    'storybook-addon-rtl',
    'storybook-addon-performance',
    'storybook-addon-pseudo-states',
    'storybook-dark-mode',
  ],
  framework: '@storybook/react-vite',
  async viteFinal(config) {
    return mergeConfig(config, {
      optimizeDeps: {
        include: [],
      },
    })
  },
}
export default config
