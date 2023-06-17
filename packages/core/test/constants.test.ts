import { describe, expect, test } from 'vitest'
import {
  DEFAULT_DATA_DIR,
  DEFAULT_DATA_FILE_EXTENSION,
  DEFAULT_OUTPUT_DIR,
  DEFAULT_OUTPUT_FILE_EXTENSION,
  DEFAULT_TEMPLATE_DIR,
  DEFAULT_TEMPLATE_FILE_EXTENSION,
} from '../src'

describe('Constants', async () => {
  test('File extension', () => {
    expect(DEFAULT_DATA_FILE_EXTENSION).toBe('.json')
    expect(DEFAULT_OUTPUT_FILE_EXTENSION).toBe('.md')
    expect(DEFAULT_TEMPLATE_FILE_EXTENSION).toBe('.tmpl.md')
  })

  test('Directory', () => {
    expect(DEFAULT_DATA_DIR).toBe('data')
    expect(DEFAULT_OUTPUT_DIR).toBe('output')
    expect(DEFAULT_TEMPLATE_DIR).toBe('template')
  })
})
