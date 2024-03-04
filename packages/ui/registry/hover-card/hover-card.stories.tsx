import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from './hover-card'

/**
 * For sighted users to preview content available behind a link.
 */
const meta = {
  title: 'components/HoverCard',
  component: HoverCard,
  argTypes: {},
  args: {},
  parameters: {
    badges: ['beta', 'stable'],
    layout: 'centered',
  },
} satisfies Meta<typeof HoverCard>

type Story = StoryObj<typeof meta>

/**
 * The default form of the hover card.
 */
export const Default: Story = {
  render: args => (
    <HoverCard {...args}>
      <HoverCardTrigger>Hover</HoverCardTrigger>
      <HoverCardContent>
        The React Framework - created and maintained by @vercel.
      </HoverCardContent>
    </HoverCard>
  ),
}

/**
 * Use the `openDelay` and `closeDelay` props to control the delay before the
 * hover card opens and closes.
 */
export const Instant: Story = {
  args: {
    openDelay: 0,
    closeDelay: 0,
  },
}

export default meta
