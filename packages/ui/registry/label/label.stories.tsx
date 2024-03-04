import type { Meta, StoryObj } from '@storybook/react'

import { Label } from './label'

/**
 * Renders an accessible label associated with controls.
 */
const meta = {
  title: 'components/Label',
  component: Label,
  argTypes: {
    children: {
      control: { type: 'text' },
    },
  },
  args: {
    children: 'Your email address',
    htmlFor: 'email',
  },
  parameters: {
    badges: ['beta', 'stable'],
  },
} satisfies Meta<typeof Label>

type Story = StoryObj<typeof Label>

/**
 * The default form of the label.
 */
export const Default: Story = {}

export default meta
