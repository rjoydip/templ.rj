import { describe, expect, it } from 'vitest'
import { getAppsDirAsync, getAppsDirSync, getArtifactsDirAsync, getArtifactsDirSync, getPackagesDirAsync, getPackagesDirSync, getRootDirAsync, getRootDirSync, getScriptsDirAsync, getScriptsDirSync, getTemplatesDirAsync, getTemplatesDirSync } from '../src'

describe('@templ/utils > path', () => {
  it('should be validate root path', async () => {
    const rootAsync = await getRootDirAsync()
    expect(getRootDirSync()).toContain('templ')
    expect(rootAsync).toContain('templ')
  })
  it('should be validate package path', async () => {
    const pkgAsync = await getPackagesDirAsync()
    expect(getPackagesDirSync()).toContain('package')
    expect(pkgAsync).toContain('package')
  })
  it('should be validate artifacts path', async () => {
    const artifactsAsync = await getArtifactsDirAsync()
    expect(getArtifactsDirSync()).toContain('artifacts')
    expect(artifactsAsync).toContain('artifacts')
  })
  it('should be validate apps path', async () => {
    const appsAsync = await getAppsDirAsync()
    expect(getAppsDirSync()).toContain('apps')
    expect(appsAsync).toContain('apps')
  })
  it('should be validate scripts path', async () => {
    const scriptsAsync = await getScriptsDirAsync()
    expect(getScriptsDirSync()).toContain('scripts')
    expect(scriptsAsync).toContain('scripts')
  })
  it('should be validate templates path', async () => {
    const templatesAsync = await getTemplatesDirAsync()
    expect(getTemplatesDirSync()).toContain('templates')
    expect(templatesAsync).toContain('templates')
  })
})
