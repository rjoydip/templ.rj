import type { Meta, StoryObj } from '@storybook/preact'

import { Templ } from '../src/components/Templ'

const meta: Meta<typeof Templ> = {
  component: Templ,
}

export default meta
type Story = StoryObj<typeof Templ>

export const TemplComponent: Story = {}
