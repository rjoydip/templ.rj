import { resolve } from 'node:path'
import { existsSync } from 'node:fs'
import { cp, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import { totalist } from 'totalist'
import type { PackageJson } from 'type-fest'
import { PKG_ROOT, ROOT } from 'src/constant'
import { intro, log, outro } from '@clack/prompts'
import { execa } from 'execa'

async function main() {
  const currDir = `${ROOT}/temp/size`
  const prevDir = `${ROOT}/temp/size-prev`
  const reportFile = `${ROOT}/size-report.md`
  intro('Size Report Generate')
  try {
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
          if (build)
            await execa('pnpm -w build')
        }
      }),
      await execa('esno ./src/size/data.ts'),
    ])

    const { stdout: sizeReport } = await execa('esno ./src/size/report.ts')
    await writeFile(reportFile, sizeReport)
    await readFile(reportFile, 'utf8')
    outro('All set')
  }
  catch (error) {
    log.error(String(error))
  }
}

main().catch(console.error)
