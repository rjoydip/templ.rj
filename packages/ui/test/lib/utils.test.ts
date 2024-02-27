import { describe, expect, it } from 'vitest'
import { cn } from '../../lib/utils'

describe('@templ/ui > utils', () => {
  it('should return a string of concatenated class names when given valid class names as inputs', () => {
    const result = cn('class1', 'class2', 'class3')
    expect(result).to.be.a('string')
    expect(result).to.equal('class1 class2 class3')
  })
  it('should return an empty string when given no inputs', () => {
    const result = cn()
    expect(result).to.be.a('string')
    expect(result).to.equal('')
  })
  it('should return a string of concatenated class names when given a single valid class name as input', () => {
    const result = cn('class1')
    expect(result).to.be.a('string')
    expect(result).to.equal('class1')
  })
  it('should return a string of concatenated class names when given nested arrays of invalid class names as inputs', () => {
    const result = cn(['invalid-class1', 'invalid-class2'], ['invalid-class3'])
    expect(result).to.be.a('string')
    expect(result).to.equal('invalid-class1 invalid-class2 invalid-class3')
  })
})
