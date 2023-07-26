import type { Meta, StoryObj } from '@storybook/preact'
import { expect } from '@storybook/jest'
import { within } from '@storybook/testing-library'

import { Header } from '../src/components/Header'

const meta: Meta<typeof Header> = {
  component: Header,
}

export default meta
type Story = StoryObj<typeof Header>

export const HeaderComponent: Story = {}

export const HeaderComponentTest: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('TEMPL')).toBeDefined()
  },
}
