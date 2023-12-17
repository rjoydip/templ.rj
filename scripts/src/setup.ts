import { readdir, rm, stat } from 'node:fs/promises'
import { join } from 'node:path'
import { cwd } from 'node:process'
import type { PathLike } from 'node:fs'
import { $ } from 'execa'
import { COMPLETED, DELETE_NODE_MODULES_LOG_MSG, POST_PROCESS_LOG_MSG, PRE_PROCESS_LOG_MSG, PROCESS_LOG_MSG, STARTED } from './constant'

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

async function preProcess() {
  console.log(`[${STARTED}]: ${PRE_PROCESS_LOG_MSG}`)
  const install = await $`pnpm -w i`
  console.log(install.stdout)
  const clean = await $`pnpm -w clean`
  console.log(clean.stdout)
  console.log(`[${COMPLETED}]: ${PRE_PROCESS_LOG_MSG}`)
}

async function process() {
  console.log(`[${STARTED}]: ${PROCESS_LOG_MSG}`)
  const lint = await $`pnpm -w lint`
  console.log(lint.stdout)
  const build = await $`pnpm -w build`
  console.log(build.stdout)
  const test = await $`pnpm -w test`
  console.log(test.stdout)
  const cli = await $`pnpm -w test:cli`
  console.log(cli.stdout)
  console.log(`[${COMPLETED}]: ${PROCESS_LOG_MSG}`)
}

async function postProcess() {
  console.log(`[${STARTED}]: ${POST_PROCESS_LOG_MSG}`)
  const changelog = await $`pnpm -w changelog`
  console.log(changelog.stdout)
  const systemInfo = await $`pnpm -w system:info`
  console.log(systemInfo.stdout)
  const updateThirdParty = await $`pnpm -w update:third_party`
  console.log(updateThirdParty.stdout)
  console.log(`[${COMPLETED}]: ${POST_PROCESS_LOG_MSG}`)
}

async function main() {
  console.log('[Started]: Setup process')
  await deleteNodeModules()
  await preProcess()
  await process()
  await postProcess()
  console.log('[Completed]: Setup process')
}

main().catch(console.error)
