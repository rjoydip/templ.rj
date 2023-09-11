// Copied - https://github.com/egoist/tsup/blob/dev/src/utils.ts

import fs from 'fs'
import { bundleRequire } from 'bundle-require'
import JoyCon from 'joycon'
import path from 'path'
import strip from 'strip-json-comments'
import type { defineConfig } from './'

const joycon = new JoyCon()

function jsoncParse(data: string) {
  try {
    return new Function('return ' + strip(data).trim())()
  } catch {
    // Silently ignore any error
    // That's what tsc/jsonc-parser did after all
    return {}
  }
}

async function loadJson(filepath: string) {
  try {
    return jsoncParse(await fs.promises.readFile(filepath, 'utf8'))
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        `Failed to parse ${path.relative(process.cwd(), filepath)}: ${
          error.message
        }`
      )
    } else {
      throw error
    }
  }
}

const jsonLoader = {
  test: /\.json$/,
  load(filepath: string) {
    return loadJson(filepath)
  },
}

joycon.addLoader(jsonLoader)

export async function loadTemplConfig(
  cwd: string,
  configFile?: string
): Promise<{ path?: string; data?: ReturnType<typeof defineConfig> }> {
  const configJoycon = new JoyCon()
  const configPath = await configJoycon.resolve({
    files: configFile
      ? [configFile]
      : [
          'templ.config.ts',
          'templ.config.js',
          'templ.config.cjs',
          'templ.config.mjs',
          'templ.config.json',
          'package.json',
        ],
    cwd,
    stopDir: path.parse(cwd).root,
    packageKey: 'templ',
  })

  if (configPath) {
    if (configPath.endsWith('.json')) {
      let data = await loadJson(configPath)
      if (configPath.endsWith('package.json')) {
        data = data.templ
      }
      if (data) {
        return { path: configPath, data }
      }
      return {}
    }

    const config = await bundleRequire({
      filepath: configPath,
    })
    return {
      path: configPath,
      data: config.mod.templ || config.mod.default || config.mod,
    }
  }

  return {}
}

export async function loadPkg(cwd: string, clearCache: boolean = false) {
  if (clearCache) {
    joycon.clearCache()
  }
  const { data } = await joycon.load(['package.json'], cwd, path.dirname(cwd))
  return data || {}
}
