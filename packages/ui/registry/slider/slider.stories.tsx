import type { Meta, StoryObj } from '@storybook/react'

import { Slider } from './slider'

/**
 * An input where the user selects a value from within a given range.
 */
const meta = {
  title: 'components/Slider',
  component: Slider,
  argTypes: {},
  args: {
    defaultValue: [33],
    max: 100,
    step: 1,
  },
  parameters: {
    badges: ['beta', 'stable'],
  },
} satisfies Meta<typeof Slider>

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

/**
 * Use the `inverted` prop to have the slider fill from right to left.
 */
export const Inverted: Story = {
  args: {
    inverted: true,
  },
}

/**
 * Use the `disabled` prop to disable the slider.
 */
export const Disabled: Story = {
  args: {
    disabled: true,
  },
}

export default meta
