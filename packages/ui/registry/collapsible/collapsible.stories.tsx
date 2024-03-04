import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Info } from 'lucide-react'

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './collapsible'

/**
 * An interactive component which expands/collapses a panel.
 */
const meta = {
  title: 'components/Collapsible',
  component: Collapsible,
  argTypes: {},
  args: {
    className: 'w-96',
    disabled: false,
  },
  parameters: {
    badges: ['beta', 'stable'],
    layout: 'centered',
  },
} satisfies Meta<typeof Collapsible>

type Story = StoryObj<typeof meta>

/**
 * The default form of the collapsible.
 */
export const Default: Story = {
  render: args => (
    <Collapsible {...args}>
      <CollapsibleTrigger className="flex gap-2">
        <h3 className="font-semibold">Can I use this in my project?</h3>
        <Info className="size-6" />
      </CollapsibleTrigger>
      <CollapsibleContent>
        Yes. Free to use for personal and commercial projects. No attribution
        required.
      </CollapsibleContent>
    </Collapsible>
  ),
} satisfies Meta<typeof Collapsible>

/**
 * Use the `disabled` prop to disable the interaction.
 */
export const Disabled: Story = {
  args: {
    disabled: true,
  },
}

export default meta
