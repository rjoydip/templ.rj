import type { StorybookConfig } from '@storybook/react-vite'
import { mergeConfig } from 'vite'

const config: StorybookConfig = {
  stories: ['../stories/*.mdx', '../registry/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@chromatic-com/storybook',
    '@geometricpanda/storybook-addon-badges',
    '@storybook/addon-essentials',
    // '@storybook/addon-interactions',
    '@storybook/addon-links',
    '@storybook/addon-onboarding',
    '@storybook/addon-storysource',
    '@storybook/addon-themes',
    'storybook-dark-mode',
    'storybook-addon-performance',
    'storybook-addon-pseudo-states',
  ],
  framework: '@storybook/react-vite',
  async viteFinal(config) {
    // Merge custom configuration into the default config
    return mergeConfig(config, {
      // Add storybook-specific dependencies to pre-optimization
      optimizeDeps: {
        include: ['storybook-addon-designs'],
      },
    })
  },
}
export default config
