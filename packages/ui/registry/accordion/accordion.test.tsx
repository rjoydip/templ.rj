import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { axe } from 'vitest-axe'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './accordion'

function renderAccordion({ args }: any) {
  const { container } = render(
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
    </Accordion>,
  )
  return container
}

const { getByText } = screen

describe('accordion component', () => {
  let container: HTMLElement

  beforeEach(() => {
    container = renderAccordion({})
  })

  afterEach(() => cleanup())

  it('should render properly', () => {
    expect(container).toMatchSnapshot()
  })
  it('should validate a11y violations for accordion', async () => {
    expect(await axe(container)).toHaveNoViolations()
  })

  it('should render content when accordion element is clicked', async () => {
    const ele = getByText(/Is it accessible?/)
    expect(ele).toBeDefined()
    fireEvent.click(ele)
  })
})
