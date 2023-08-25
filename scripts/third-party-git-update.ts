import fs, { lstatSync } from 'node:fs'
import { join, normalize } from 'node:path'
import { glob } from 'glob'
import { listBranches, pull } from 'isomorphic-git'
import http from 'isomorphic-git/http/node'
import { COMPLETED, STARTED, logError } from './utils'

void (async () => {
  try {
    console.log(`[${STARTED}]: Update branch for all third_party applications`)
    await Promise.allSettled([
      ...(
        await glob('third_party/*', {
          cwd: normalize(join(process.cwd(), '..')),
          absolute: true,
        })
      )
        .filter((i) => lstatSync(i).isDirectory())
        .map(async (dir) => {
          const branches = await listBranches({ fs, dir })
          const mainOrMasterBranch = branches
            .filter((i) => i.includes('master') || i.includes('main'))
            .pop()
          await pull({
            fs,
            http,
            dir,
            ref: mainOrMasterBranch,
            singleBranch: true,
          })
          return true
        }),
    ])
    console.log(
      `[${COMPLETED}]: Update branch for all third_party applications`,
    )
  } catch (error) {
    logError(error)
  }
})()
