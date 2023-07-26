import { describe, expect, test } from 'vitest'
import * as baseJSON from '../../src/ts/base.json'

describe('@templ/config > Base JSON', () => {
  test('schema', () => {
    expect(typeof baseJSON.$schema).toBeDefined()
    expect(baseJSON.$schema).toBe('https://json.schemastore.org/tsconfig')
  })
  test('display', () => {
    expect(typeof baseJSON.display).toBe('string')
    expect(baseJSON.display).toBe('Default')
  })
  test('compilerOptions', () => {
    expect(typeof baseJSON.compilerOptions).toBe('object')
    // target
    expect(typeof baseJSON.compilerOptions.target).toBe('string')
    expect(baseJSON.compilerOptions.target).toBe('esnext')
    // skipLibCheck
    expect(typeof baseJSON.compilerOptions.skipLibCheck).toBe('boolean')
    expect(baseJSON.compilerOptions.skipLibCheck).toBe(true)
    // outDir
    expect(typeof baseJSON.compilerOptions.outDir).toBe('string')
    expect(baseJSON.compilerOptions.outDir).toBe('./dist')
    // esModuleInterop
    expect(typeof baseJSON.compilerOptions.esModuleInterop).toBe('boolean')
    expect(baseJSON.compilerOptions.esModuleInterop).toBe(true)
    // allowJs
    expect(typeof baseJSON.compilerOptions.allowJs).toBe('boolean')
    expect(baseJSON.compilerOptions.allowJs).toBe(true)
    // strict
    expect(typeof baseJSON.compilerOptions.strict).toBe('boolean')
    expect(baseJSON.compilerOptions.strict).toBe(true)
    // strictNullChecks
    expect(typeof baseJSON.compilerOptions.strictNullChecks).toBe('boolean')
    expect(baseJSON.compilerOptions.strictNullChecks).toBe(true)
    // resolveJsonModule
    expect(typeof baseJSON.compilerOptions.resolveJsonModule).toBe('boolean')
    expect(baseJSON.compilerOptions.resolveJsonModule).toBe(true)
    // skipDefaultLibCheck
    expect(typeof baseJSON.compilerOptions.skipDefaultLibCheck).toBe('boolean')
    expect(baseJSON.compilerOptions.skipDefaultLibCheck).toBe(true)
    // declaration
    expect(typeof baseJSON.compilerOptions.declaration).toBe('boolean')
    expect(baseJSON.compilerOptions.declaration).toBe(true)
    // inlineSourceMap
    expect(typeof baseJSON.compilerOptions.inlineSourceMap).toBe('boolean')
    expect(baseJSON.compilerOptions.inlineSourceMap).toBe(true)
    // noUnusedLocals
    expect(typeof baseJSON.compilerOptions.noUnusedLocals).toBe('boolean')
    expect(baseJSON.compilerOptions.noUnusedLocals).toBe(true)
    // noUnusedParameters
    expect(typeof baseJSON.compilerOptions.noUnusedParameters).toBe('boolean')
    expect(baseJSON.compilerOptions.noUnusedParameters).toBe(true)
    // noFallthroughCasesInSwitch
    expect(typeof baseJSON.compilerOptions.noFallthroughCasesInSwitch).toBe(
      'boolean',
    )
    expect(baseJSON.compilerOptions.noFallthroughCasesInSwitch).toBe(true)
    // allowImportingTsExtensions
    expect(typeof baseJSON.compilerOptions.allowImportingTsExtensions).toBe(
      'boolean',
    )
    expect(baseJSON.compilerOptions.allowImportingTsExtensions).toBe(true)
    // noEmit
    expect(typeof baseJSON.compilerOptions.noEmit).toBe('boolean')
    expect(baseJSON.compilerOptions.noEmit).toBe(true)
    // useDefineForClassFields
    expect(typeof baseJSON.compilerOptions.useDefineForClassFields).toBe(
      'boolean',
    )
    expect(baseJSON.compilerOptions.useDefineForClassFields).toBe(true)
    // composite
    expect(typeof baseJSON.compilerOptions.composite).toBe('boolean')
    expect(baseJSON.compilerOptions.composite).toBe(false)
    // forceConsistentCasingInFileNames
    expect(
      typeof baseJSON.compilerOptions.forceConsistentCasingInFileNames,
    ).toBe('boolean')
    expect(baseJSON.compilerOptions.forceConsistentCasingInFileNames).toBe(true)
    // inlineSources
    expect(typeof baseJSON.compilerOptions.inlineSources).toBe('boolean')
    expect(baseJSON.compilerOptions.inlineSources).toBe(false)
    // isolatedModules
    expect(typeof baseJSON.compilerOptions.isolatedModules).toBe('boolean')
    expect(baseJSON.compilerOptions.isolatedModules).toBe(true)
    // preserveWatchOutput
    expect(typeof baseJSON.compilerOptions.preserveWatchOutput).toBe('boolean')
    expect(baseJSON.compilerOptions.preserveWatchOutput).toBe(true)
    // downlevelIteration
    expect(typeof baseJSON.compilerOptions.downlevelIteration).toBe('boolean')
    expect(baseJSON.compilerOptions.downlevelIteration).toBe(true)
  })
  test('exclude', () => {
    expect(typeof baseJSON.exclude).toBe('object')
    expect(baseJSON.exclude).toStrictEqual(['node_modules'])
  })
})
