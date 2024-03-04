import type { Meta, StoryObj } from '@storybook/react'
import { Loader2, Mail } from 'lucide-react'

import React from 'react'
import { Button } from './button'

const meta: Meta<typeof Button> = {
  title: 'components/Button',
  component: Button,
  argTypes: {},
  parameters: {
    badges: ['beta', 'stable'],
  },
}

type Story = StoryObj<typeof Button>

export const Default: Story = {
  render: args => <Button {...args}>Default</Button>,
  args: {},
}
export const Outline: Story = {
  render: args => <Button {...args}>Outline</Button>,
  args: {
    variant: 'outline',
  },
}
export const Ghost: Story = {
  render: args => <Button {...args}>Ghost</Button>,
  args: {
    variant: 'ghost',
  },
}
export const Secondary: Story = {
  render: args => <Button {...args}>Secondary</Button>,
  args: {
    variant: 'secondary',
  },
}
export const Link: Story = {
  render: args => <Button {...args}>Link</Button>,
  args: {
    variant: 'link',
  },
}
export const Loading: Story = {
  render: args => (
    <Button {...args}>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Loading
    </Button>
  ),
  args: {
    variant: 'outline',
  },
}
export const WithIcon: Story = {
  render: args => (
    <Button {...args}>
      <Mail className="mr-2 h-4 w-4" />
      {' '}
      Login with Email Button
    </Button>
  ),
  args: {
    variant: 'secondary',
  },
}

export default meta
