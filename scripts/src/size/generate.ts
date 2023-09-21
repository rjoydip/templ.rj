import { exec } from 'node:child_process'
import { resolve } from 'node:path'
import { rm, readdir, readFile, writeFile, cp, access } from 'node:fs/promises'
import { promisify } from 'node:util'
import { totalist } from 'totalist'
import type { PackageJson } from 'type-fest'
import { createLogger, logError } from '@templ/logger'
import { pkgRoot, root } from '@templ/utils'

async function main() {
  try {
    const $exec = promisify(exec)
    const currDir = `${root}/temp/size`
    const prevDir = `${root}/temp/size-prev`
    const reportFile = `${root}/size-report.md`

    await access(currDir)
    await totalist(currDir, async (name: string, abs: string) => {
      if (/\.json$/.test(name)) {
        await cp(abs, resolve(prevDir, name), { force: true })
      }
    })
    await rm(`${root}/temp/size`, { recursive: true, force: true })
    await Promise.all([
      ...(await readdir(pkgRoot)).map(async (pkgName) => {
        const { scripts }: PackageJson = JSON.parse(
          await readFile(resolve(pkgRoot, pkgName, 'package.json'), 'utf8'),
        )
        if (scripts.build) {
          await $exec('pnpm run build', {
            cwd: resolve(pkgRoot, pkgName),
          })
        }
      }),
    ])
    await $exec('pnpm run size:data')
    const { stdout: sizeReport } = await $exec('pnpm run --silent size:report')
    await writeFile(reportFile, sizeReport)
    const sizeReportContent = await readFile(reportFile, 'utf8')
    createLogger().log(sizeReportContent)
  } catch (err) {
    logError(err)
  }
}

main()
