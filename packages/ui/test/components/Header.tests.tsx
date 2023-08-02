import { describe, expect, test } from 'vitest'
import { render } from '@testing-library/preact'

import { Templ } from '../../src/components/Templ'

describe('@templ/ui > Header', () => {
  test('should be rendered header component', () => {
    const { container } = render(<Templ />)
    expect(container.textContent).toMatch('TEMPL')
  })
})
