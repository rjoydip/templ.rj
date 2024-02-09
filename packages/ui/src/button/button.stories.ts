import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { Button } from './button'

const meta = {
  title: 'Example/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: [],
  argTypes: {
    variant: {
      options: ['primary', 'secondary'],
    },
  },
  args: { onClick: fn() },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    size: 'default',
    title: 'Button',
  },
}

export const Large: Story = {
  args: {
    size: 'lg',
    title: 'Button',
  },
}

export const Small: Story = {
  args: {
    size: 'sm',
    title: 'Button',
  },
}

export const Icon: Story = {
  args: {
    size: 'icon',
    title: 'Button',
  },
}
