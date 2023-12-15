import { readdir, rm, stat } from 'node:fs/promises'
import { join } from 'node:path'
import { cwd } from 'node:process'
import type { PathLike } from 'node:fs'
import { execCmd } from './utils'
import { COMPLETED, DELETE_NODE_MODULES_LOG_MSG, POST_VALIDATION_PROCESS_LOG_MSG, PRE_VALIDATION_PROCESS_LOG_MSG, STARTED, VALIDATION_PROCESS_LOG_MSG } from './constant.js'

async function findNodeModulesFolders(dir: PathLike) {
  const nodeModulesFolders: string[] = []

  const files = await readdir(dir)
  for (const file of files) {
    const filePath = join(dir.toString(), file)
    const isDirectory = (await stat(filePath)).isDirectory()

    if (isDirectory) {
      if (file === 'node_modules') {
        nodeModulesFolders.push(filePath)
      }
      else {
        const nestedNodeModulesFolders = await findNodeModulesFolders(filePath)
        nodeModulesFolders.push(...nestedNodeModulesFolders)
      }
    }
  }

  return nodeModulesFolders
}

async function deleteNodeModules(_cwd = cwd()) {
  console.log(`[${STARTED}]: ${DELETE_NODE_MODULES_LOG_MSG}`)
  const nodeModulesFolders = await findNodeModulesFolders(_cwd)
  await Promise.all([
    ...nodeModulesFolders.map(async (folder: PathLike) => {
      await rm(folder, { recursive: true, force: true })
    }),
  ])
  console.log(`[${COMPLETED}]: ${DELETE_NODE_MODULES_LOG_MSG}`)
}

async function preValidationProcess() {
  console.log(`[${STARTED}]: ${PRE_VALIDATION_PROCESS_LOG_MSG}`)
  await execCmd('pnpm i', {
    msg: 'Installation',
  })

  await execCmd('pnpm clean', {
    msg: 'Clean',
  })

  console.log(`[${COMPLETED}]: ${PRE_VALIDATION_PROCESS_LOG_MSG}`)
}

async function validationProcess() {
  console.log(`[${STARTED}]: ${VALIDATION_PROCESS_LOG_MSG}`)
  await execCmd('pnpm lint', {
    msg: 'Linting',
  })

  await execCmd('pnpm test', {
    msg: 'Unit testing',
  })

  await execCmd('pnpm test:cli', {
    msg: 'Cli testing',
  })
  console.log(`[${COMPLETED}]: ${VALIDATION_PROCESS_LOG_MSG}`)
}

async function postValidationProcess() {
  console.log(`[${STARTED}]: ${POST_VALIDATION_PROCESS_LOG_MSG}`)
  await execCmd('pnpm update:third_party', {
    msg: 'Update third party git',
  })
  console.log(`[${COMPLETED}]: ${POST_VALIDATION_PROCESS_LOG_MSG}`)
}

async function main() {
  console.log('[Started]: Setup process')

  await deleteNodeModules()
  await preValidationProcess()
  await validationProcess()
  await postValidationProcess()

  console.log('[Completed]: Setup process')
}

main()
