import { describe, expect, test } from 'vitest'
import { BuildOptionSchema, BuildTypeSchema, FormatSchema, NonBuildOptionSchema } from '../src/schema'

describe('@templ/build > Schema', () => {
  describe('buildTypeSchema', () => {
    test('should validate with valid data', () => {
      expect(BuildTypeSchema.parse('esbuild')).toBe('esbuild')
      expect(BuildTypeSchema.parse('rollup')).toBe('rollup')
    })
    test('should validate with invalid data', () => {
      expect(() => BuildTypeSchema.parse('xyz')).toThrowError()
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
      expect(NonBuildOptionSchema.parse({})).not.empty
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
        })
      ).not.empty
    })
  })
  describe('BuildOptionSchema', () => {
    test('should validate with valid options data', () => {
      expect(BuildOptionSchema.parse({})).not.empty
    })
    test('should validate with valid default data', () => {
      expect(
        BuildOptionSchema.parse({
          format: ['cjs', 'esm', 'iife'],
          minify: true,
          outDir: 'dist'
        })
      ).not.empty
    })
  })
})
