import { join, resolve } from 'node:path'
import { exec } from 'node:child_process'
import { rm, readdir, readFile, writeFile } from 'node:fs/promises'
import type { PackageJson } from 'type-fest'
import { createLogger, logError } from '@templ/logger'
import { pkgRoot, root } from '@templ/utils'

async function main() {
  try {
    await rm(`${root}/temp/size`, { recursive: true, force: true })
    await Promise.all([
      ...(await readdir(pkgRoot)).map(async (pkgName) => {
        const { scripts }: PackageJson = JSON.parse(await readFile(join(pkgRoot, pkgName, 'package.json'), 'utf8'))
        if (scripts.build) {
          await exec('pnpm run build', {
            cwd: join(pkgRoot, pkgName)
          })
        }
      })
    ])
    await exec('pnpm run size:data', {
      cwd: resolve(process.cwd())
    })
    const { stdout: sizeReport } = await exec('pnpm run --silent size:report', {
      cwd: resolve(process.cwd())
    })
    await writeFile(`${root}/size-report.md`, sizeReport)
    const sizeReportContent = await readFile(`${root}/size-report.md`, 'utf8')
    createLogger().log(sizeReportContent)
  } catch (err) {
    logError(err)
  }
}

main()
