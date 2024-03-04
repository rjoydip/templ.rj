import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { within } from '@storybook/testing-library'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './accordion'

/**
 * A vertically stacked set of interactive headings that each reveal a section
 * of content.
 */
const meta = {
  title: 'components/Accordion',
  component: Accordion,
  argTypes: {
    type: {
      options: ['single', 'multiple'],
      control: { type: 'radio' },
    },
  },
  args: {
    type: 'single',
    collapsible: true,
  },
  parameters: {
    direction: 'ltr',
    badges: ['beta', 'stable'],
  },
} satisfies Meta<typeof Accordion>

type Story = StoryObj<typeof meta>

/**
 * The default behavior of the accordion allows only one item to be open.
 */
export const Default: Story = {
  render: args => (
    <Accordion {...args}>
      <AccordionItem value="item-1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>
          Yes. It adheres to the WAI-ARIA design pattern.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Is it styled?</AccordionTrigger>
        <AccordionContent>
          Yes. It comes with default styles that matches the other components'
          aesthetic.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Is it animated?</AccordionTrigger>
        <AccordionContent>
          Yes. It's animated by default, but you can disable it if you prefer.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await canvas.getByText('Is it accessible?')
  },
} satisfies Meta<typeof Accordion>

export default meta
