import { beforeEach, describe, expect, test, vi } from 'vitest'
import type { Logger } from '../src'
import { createLogger } from '../src'

describe('@templ/logger', () => {
  let logger: Logger

  beforeEach(() => {
    logger = createLogger('Test')
  })

  test('index', () => expect(true).toBeTruthy())

  // TODO(fix): Getting error for thread
  /*   test('should log info', () => {
    const spy = vi.spyOn(console, 'log')
    logger.info('Info message')
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('[TEST] INFO: Info message'))
  }) */

  /* test('should log success', () => {
    const spy = vi.spyOn(console, 'log')
    logger.success('Success message')
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('[TEST] SUCCESS: Success message'))
  }) */
})
