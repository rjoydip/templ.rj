import type { Meta, StoryObj } from '@storybook/react'

import React from 'react'
import type {
  ToastActionElement,
  ToastProps,
} from './toast'
import {
  Toast,
  ToastAction,
} from './toast'
import { Toaster } from './toaster'
import { useToast } from './use-toast'

/**
 * A succinct message that is displayed temporarily.
 */
const meta = {
  title: 'components/Toast',
  component: Toast,
  argTypes: {},
  parameters: {
    badges: ['beta', 'stable'],
    layout: 'centered',
  },
} satisfies Meta<typeof Toast>

export default meta

type Story = Omit<StoryObj<typeof meta>, 'args'> & {
  args: Omit<ToasterToast, 'id'>
}

type ToasterToast = ToastProps & {
  id: string
  title?: string
  description?: string
  action?: ToastActionElement
}

function ToastExample(args: Story['args']) {
  const { toast } = useToast()
  return (
    <div>
      <button
        onClick={() => {
          toast(args)
        }}
      >
        Show Toast
      </button>
      <Toaster />
    </div>
  )
}

/**
 * The default form of the toast.
 */
export const Default: Story = {
  args: {
    description: 'Your message has been sent.',
  },
  render: args => <ToastExample {...args} />,
}

/**
 * Use the `title` prop to provide a title for the toast.
 */
export const WithTitle: Story = {
  args: {
    title: 'Uh oh! Something went wrong.',
    description: 'There was a problem with your request.',
  },
  render: args => <ToastExample {...args} />,
}

/**
 * Use the `action` prop to provide an action for the toast.
 */
export const WithAction: Story = {
  args: {
    title: 'Uh oh! Something went wrong.',
    description: 'There was a problem with your request.',
    action: <ToastAction altText="Try again">Try again</ToastAction>,
  },
  render: args => <ToastExample {...args} />,
}

/**
 * Use the `destructive` variant to indicate a destructive action.
 */
export const Destructive: Story = {
  args: {
    variant: 'destructive',
    title: 'Uh oh! Something went wrong.',
    description: 'There was a problem with your request.',
    action: <ToastAction altText="Try again">Try again</ToastAction>,
  },
  render: args => <ToastExample {...args} />,
}
