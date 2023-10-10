import { readdir, rm, stat } from 'node:fs/promises'
import { join } from 'node:path'
import { cwd } from 'node:process'
import { execSync } from 'node:child_process'

async function findNodeModulesFolders(dir) {
  const nodeModulesFolders = []

  const files = await readdir(dir)
  for (const file of files) {
    const filePath = join(dir, file)
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

async function main() {
  const nodeModulesFolders = await findNodeModulesFolders(join(cwd()))

  console.log('Deleting node modules')
  nodeModulesFolders.forEach(async (folder) => {
    await rm(folder, { recursive: true, force: true })
  })

  console.log('Installing npm packages')
  execSync('pnpm i')

  console.log('Setup completed')
}

main()
