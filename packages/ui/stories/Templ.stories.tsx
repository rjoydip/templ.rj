import type { Meta, StoryObj } from '@storybook/preact'
import { expect } from '@storybook/jest'
import { within } from '@storybook/testing-library'

import { Templ } from '../src/components/Templ'

const meta: Meta<typeof Templ> = {
  component: Templ,
}

export default meta
type Story = StoryObj<typeof Templ>

export const TemplComponent: Story = {}

export const TemplComponentTest: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('TEMPL')).toBeDefined()
  },
}
