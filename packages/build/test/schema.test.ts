import { describe, expect, test } from 'vitest'
import { createLogger } from '@templ/logger'
import { BuildOptionSchema, CompileTypeSchema, DTSPluginSchema, FormatSchema, NonBuildOptionSchema } from '../src/schema'

describe('@templ/build > Schema', () => {
  const logger = createLogger()
  describe('CompileTypeSchema', () => {
    test('should validate with valid data', () => {
      expect(CompileTypeSchema.parse('esbuild')).toBe('esbuild')
      expect(CompileTypeSchema.parse('rollup')).toBe('rollup')
    })
    test('should validate with invalid data', () => {
      expect(() => CompileTypeSchema.parse('xyz')).toThrowError()
    })
  })
  describe('FormatSchema', () => {
    test('should validate with valid data', () => {
      expect(FormatSchema.parse('cjs')).toBe('cjs')
      expect(FormatSchema.parse('esm')).toBe('esm')
      expect(FormatSchema.parse('iife')).toBe('iife')
    })
    test('should validate with invalid data', () => {
      expect(() => FormatSchema.parse('xyz')).toThrowError()
    })
  })
  describe('NonBuildOptionSchema', () => {
    test('should validate with valid options data', () => {
      expect(NonBuildOptionSchema.parse({
        logger
      })).not.empty
    })
    test('should validate with valid default data', () => {
      expect(
        NonBuildOptionSchema.parse({
          clean: true,
          dts: true,
          excludes: [],
          includes: [],
          srcDir: 'src',
          type: 'esbuild',
          watch: false,
          logger
        })
      ).not.empty
    })
  })
  describe('BuildOptionSchema', () => {
    test('should validate with valid options data', () => {
      expect(BuildOptionSchema.parse({
        logger
      })).not.empty
    })
    test('should validate with valid default data', () => {
      expect(
        BuildOptionSchema.parse({
          format: ['cjs', 'esm', 'iife'],
          minify: true,
          outDir: 'dist',
          target: 'esnext',
          logger
        })
      ).not.empty
    })
  })
  describe('DTSPluginSchema', () => {
    test('should validate with valid options data', () => {
      expect(DTSPluginSchema.parse({})).not.empty
    })
    test('should validate with valid default data', () => {
      expect(
        DTSPluginSchema.parse({
          debug: false,
          tsconfig: 'tsconfig.json',
          outDir: 'dist'
        })
      ).not.empty
    })
  })
})

