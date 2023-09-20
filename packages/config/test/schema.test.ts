import { describe, expect, expectTypeOf, test } from 'vitest'
import { createLogger } from '@templ/logger'
import {
  BuildSchema,
  CompileTypeSchema,
  DTSPluginSchema,
  FormatSchema,
  NonBuildSchema,
} from '../src/schema'
import type {
  BuildOptions,
  CompileType,
  DTSPlugin,
  Format,
  NonBuildOptions,
} from '../src/schema'

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
      expect(
        NonBuildSchema.parse({
          logger,
        }),
      ).not.empty
    })
    test('should validate with valid default data', () => {
      expect(
        NonBuildSchema.parse({
          clean: true,
          dts: true,
          excludes: [],
          includes: [],
          srcDir: 'src',
          type: 'esbuild',
          watch: false,
          logger,
        }),
      ).not.empty
    })
  })
  describe('BuildOptionSchema', () => {
    test('should validate with valid options data', () => {
      expect(
        BuildSchema.parse({
          logger,
        }),
      ).not.empty
    })
    test('should validate with valid default data', () => {
      expect(
        BuildSchema.parse({
          format: ['cjs', 'esm', 'iife'],
          minify: true,
          outDir: 'dist',
          target: 'esnext',
          logger,
        }),
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
          outDir: 'dist',
        }),
      ).not.empty
    })
  })
})

describe('@templ/build > Types', () => {
  test('should validate that the value is of type CompileType', () => {
    expectTypeOf<CompileType>().toMatchTypeOf<'esbuild' | 'rollup'>()
  })
  test('should validate that the value is of type FormatSchema', () => {
    expectTypeOf<Format>().toMatchTypeOf<'cjs' | 'esm' | 'iife'>()
  })
  test('should validate that the value is of type NonBuildOptions', () => {
    expectTypeOf<NonBuildOptions>().toMatchTypeOf<{
      assets?: string[]
      clean?: boolean
      dts?: boolean
      excludes?: string[]
      includes?: string[]
      srcDir?: string
      type?: string
      watch?: boolean
    }>()
  })
  test('should validate that the value is of type NonBuildOptions', () => {
    expectTypeOf<BuildOptions>().toMatchTypeOf<{
      format?: Format[]
      minify?: boolean
      outDir?: string
      esnext?: string
    }>()
  })
  test('should validate that the value is of type DTSPlugin', () => {
    expectTypeOf<DTSPlugin>().toMatchTypeOf<{
      debug?: boolean
      outDir?: string
      tsconfig?: string
    }>()
  })
})
