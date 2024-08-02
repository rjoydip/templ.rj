import { cwd } from 'node:process'
import { join } from 'node:path'
import { existsSync } from 'node:fs'
import { readdir, rm, stat } from 'node:fs/promises'

async function deleteNodeModules(path) {
  if (!existsSync(path)) {
    return
  }

  const files = await readdir(path)

  for await (const file of files) {
    const filePath = join(path.toString(), file)
    const fStat = await stat(filePath)
    if (fStat.isDirectory()) {
      if (!file.startsWith('.') && file !== 'node_modules') {
        await deleteNodeModules(filePath)
      }

      if (file === 'node_modules') {
        await rm(filePath, { recursive: true, force: true })
        console.log(`Deleted node_modules in: ${path}`)
      }
    }
  }
}

export async function run() {
  await deleteNodeModules(cwd())
  console.log('Node modules deleted successfully')
  await rm(`${cwd()}/.turbo`, { recursive: true, force: true })
  console.log('.turbo (root) deleted successfully')
}

run().catch(console.error)
