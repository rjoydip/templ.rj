import * as React from 'react'

import type { Meta, StoryObj } from '@storybook/react'
import { AlertCircle } from 'lucide-react'

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from './alert'

/**
 * Displays a callout for user attention.
 */
const meta = {
  title: 'ui/Alert',
  component: Alert,
  argTypes: {
    variant: {
      options: ['default', 'destructive'],
      control: { type: 'radio' },
    },
  },
  args: {
    variant: 'default',
  },
  parameters: {
    badges: ['beta', 'stable'],
  },
} satisfies Meta<typeof Alert>

export default meta

type Story = StoryObj<typeof meta>
/**
 * The default form of the alert.
 */
export const Default: Story = {
  render: args => (
    <Alert {...args}>
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        You can add components to your app using the cli.
      </AlertDescription>
    </Alert>
  ),
}

/**
 * Use the `destructive` alert to indicate a destructive action.
 */
export const Destructive: Story = {
  render: args => (
    <Alert {...args}>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        Your session has expired. Please log in again.
      </AlertDescription>
    </Alert>
  ),
  args: {
    variant: 'destructive',
  },
}
