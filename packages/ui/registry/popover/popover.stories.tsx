import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './popover'

/**
 * Displays rich content in a portal, triggered by a button.
 */
const meta = {
  title: 'components/Popover',
  component: Popover,
  argTypes: {},
  parameters: {
    badges: ['beta', 'stable'],
    layout: 'centered',
  },
} satisfies Meta<typeof Popover>

type Story = StoryObj<typeof meta>

/**
 * The default form of the popover.
 */
export const Default: Story = {
  render: args => (
    <Popover {...args}>
      <PopoverTrigger>Open</PopoverTrigger>
      <PopoverContent>Place content for the popover here.</PopoverContent>
    </Popover>
  ),
}

export default meta
