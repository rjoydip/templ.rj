import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'

import { Checkbox } from './checkbox'

/**
 * A control that allows the user to toggle between checked and not checked.
 */
const meta: Meta<typeof Checkbox> = {
  title: 'components/Checkbox',
  component: Checkbox,
  argTypes: {},
  args: {
    id: 'terms',
    disabled: false,
  },
  parameters: {
    badges: ['beta', 'stable'],
    layout: 'centered',
  },
} satisfies Meta<typeof Checkbox>

type Story = StoryObj<typeof meta>

/**
 * The default form of the checkbox.
 */
export const Default: Story = {
  render: args => (
    <div className="flex space-x-2">
      <Checkbox {...args} />
      <label
        htmlFor={args.id}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
      >
        Accept terms and conditions
      </label>
    </div>
  ),
}

/**
 * Use the `disabled` prop to disable the checkbox.
 */
export const Disabled: Story = {
  args: {
    id: 'disabled-terms',
    disabled: true,
  },
}
export default meta
