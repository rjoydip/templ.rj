import { existsSync, statSync } from 'node:fs'
import { copyFile, mkdir } from 'node:fs/promises'
import { join, parse } from 'node:path'
import { cwd } from 'node:process'
import fg from 'fast-glob'
import { createLogger } from '@templ/logger'
import { pkgRoot, root } from '@templ/utils'

const packagesDir = typeof pkgRoot === 'string' ? pkgRoot : cwd()
const coverageDir: string = join(typeof root === 'string' ? root : cwd(), 'coverage')
const logger = createLogger()

/**
 * The function checks if a folder exists at the specified path and creates it if it doesn't exist.
 * @param folderPath - The `folderPath` parameter is a string that represents the path of the folder
 * you want to create.
 */
async function createFolderIfNotExists(folderPath: string): Promise<void> {
  if (!existsSync(folderPath)) {
    await mkdir(folderPath, { recursive: true })
    logger.success('[lcov]:', `Folder "${folderPath}" created.`)
  }
  else {
    logger.success('[lcov]:', `Folder "${folderPath}" already exists.`)
  }
}

/**
 * The function checks if a file is empty by checking its size.
 * @param filePath - The `filePath` parameter is a string that represents the path to the file you want
 * to check if it is empty or not.
 * @returns a boolean value. It returns true if the file at the given filePath is empty (has a size of
 * 0 bytes), and false otherwise.
 */
function isFileEmpty(filePath: string): boolean {
  try {
    const stats = statSync(filePath)
    return stats.size === 0
  }
  catch (error) {
    logger.error('Error checking file:', error)
    return false
  }
}

async function getLcovFiles(): Promise<void> {
  const lcovFiles: string[] = (await fg.async('**/coverage/lcov.info', {
    cwd: packagesDir,
    absolute: true,
    ignore: ['**/node_modules/**']
  })).filter(file => !isFileEmpty(file))
  try {
    await createFolderIfNotExists(coverageDir)
    for (const lcovFile of lcovFiles) {
      await copyFile(
        lcovFile,
        `${coverageDir}/${parse(lcovFile).dir.split('/').at(-2)}.lcov.info`,
      )
    }
    logger.success('[lcov]:', 'Copied lcov.info files to root coverage directory')
  }
  catch (error) {
    logger.error('Error copying LCOV files:', error)
  }
}

(async function () {
  await getLcovFiles()
})()
