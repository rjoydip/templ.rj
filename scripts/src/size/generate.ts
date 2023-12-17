import { exec } from 'node:child_process'
import { resolve } from 'node:path'
import { existsSync } from 'node:fs'
import { cp, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import { promisify } from 'node:util'
import { totalist } from 'totalist'
import type { PackageJson } from 'type-fest'
import { PKG_ROOT, ROOT } from 'src/constant'

async function main() {
  try {
    const $exec = promisify(exec)
    const currDir = `${ROOT}/temp/size`
    const prevDir = `${ROOT}/temp/size-prev`
    const reportFile = `${ROOT}/size-report.md`

    if (existsSync(currDir)) {
      await totalist(currDir, async (name: string, abs: string) => {
        if (/\.json$/.test(name))
          await cp(abs, resolve(prevDir, name), { force: true })
      })
    }

    await Promise.all([
      await rm(currDir, { recursive: true, force: true }),
      ...(await readdir(PKG_ROOT)).map(async (pkgName) => {
        const pkgJSONPath = resolve(PKG_ROOT, pkgName, 'package.json')
        const pkgData: PackageJson = existsSync(pkgJSONPath) ? await readFile(pkgJSONPath, 'utf8') : JSON.parse('{ "scripts": {} }')
        if (pkgData.scripts) {
          const { build } = pkgData
          if (build) {
            await $exec('pnpm run build', {
              cwd: resolve(PKG_ROOT, pkgName),
            })
          }
        }
      }),
      await $exec('pnpm run size:data'),
    ])

    const { stdout: sizeReport } = await $exec('pnpm run --silent size:report')
    await writeFile(reportFile, sizeReport)
    await readFile(reportFile, 'utf8')
  }
  catch (err) {
    console.error(err)
  }
}

main().catch(console.error)
