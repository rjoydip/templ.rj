import type { Meta, StoryObj } from '@storybook/preact'

import { Templ } from '../src/components/Templ'

/* The code is defining a constant variable named `meta` of type `Meta<typeof Templ>`. The value of
`meta` is an object with a property `component` that references the `Templ` component. The `Meta`
type is likely a type definition for Storybook metadata, which is used to describe the component
being documented in Storybook. */
const meta: Meta<typeof Templ> = {
  component: Templ,
}

export default meta
type Story = StoryObj<typeof Templ>

/* `export const TemplComponent: Story = {}` is exporting a variable named `TemplComponent` of type
`Story`. The value of `TemplComponent` is an empty object `{}`. */
export const TemplComponent: Story = {}
