import type { Meta, StoryObj } from '@storybook/react'

import { Badge } from './badge'

/**
 * Displays a badge or a component that looks like a badge.
 */
const meta = {
  title: 'components/Badge',
  component: Badge,
  argTypes: {
    children: {
      control: 'text',
    },
  },
  args: {
    children: 'Badge',
  },
  parameters: {
    badges: ['beta', 'stable'],
    layout: 'centered',
  },
} satisfies Meta<typeof Badge>

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

/**
 * Use the `secondary` badge to call for less urgent information, blending
 * into the interface while still signaling minor updates or statuses.
 */
export const Secondary: Story = {
  args: {
    variant: 'secondary',
  },
}

/**
 * Use the `destructive` badge to  indicate errors, alerts, or the need for
 * immediate attention.
 */
export const Destructive: Story = {
  args: {
    variant: 'destructive',
  },
}

/**
 * Use the `outline` badge for overlaying without obscuring interface details,
 * emphasizing clarity and subtlety..
 */
export const Outline: Story = {
  args: {
    variant: 'outline',
  },
}

export default meta
