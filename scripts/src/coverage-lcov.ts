import { existsSync, statSync } from 'node:fs'
import { copyFile, mkdir, writeFile } from 'node:fs/promises'
import { join, parse, sep } from 'node:path'
import fg from 'fast-glob'
import lcovParse from 'lcov-parse'
import { createLogger } from '@templ/logger'
import { pkgRoot, root } from '@templ/utils'

const combinedReport: string[] = []
const packagesDir: string = pkgRoot
const coverageDir: string = join(root, 'coverage')
const logger = createLogger()

/**
 * The function checks if a folder exists at the specified path and creates it if it doesn't exist.
 * @param folderPath - The `folderPath` parameter is a string that represents the path of the folder
 * you want to create.
 */
async function createFolderIfNotExists(folderPath: string): Promise<void> {
  if (!existsSync(folderPath)) {
    await mkdir(folderPath, { recursive: true })
    logger.info(`Folder "${folderPath}" created.`)
  } else {
    logger.info(`Folder "${folderPath}" already exists.`)
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
  } catch (error) {
    logger.error('Error checking file:', error)
    return false
  }
}

/**
 * The function `processFile` takes a file as input, parses it using lcovParse, and converts the parsed
 * data back to LCOV format.
 * @param file - The `file` parameter is the path or URL of the file that needs to be processed. It is
 * passed to the `processFile` function.
 * @returns The function `processFile` is returning a Promise.
 */
function processFile(file: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    lcovParse(file, (err: string, data) => {
      if (err) {
        reject(err)
      } else {
        const lcovContent = data.map((entry) => {
          return `SF:${entry.file}\n${entry.lines.details
            .map((line) => `DA:${line.line},${line.hit}`)
            .join('\n')}\nend_of_record`
        })
        combinedReport.push(...lcovContent)
        resolve()
      }
    })
  })
}

/**
 * The function `getLcovFiles` returns a list of non-empty lcov.info files found in the `coverage`
 * directory of each package.
 * @returns The function `getLcovFiles` returns a promise that resolves to an array of file paths.
 * These file paths are obtained by using the `glob` function to search for files matching the pattern
 * coverage/lcov.info in the packagesDir directory. The resulting file paths are then filtered
 * to exclude any files that are empty.
 */
async function getLcovFiles(): Promise<string[]> {
  const files: string[] = await fg.async('**/coverage/lcov.info', {
    cwd: packagesDir,
    absolute: true,
  })
  return files.filter((file) => !isFileEmpty(file))
}

/**
 * The function copies LCOV files to the root coverage directory.
 */
async function copyLcovFilesToRootCoverageDir(): Promise<void> {
  const lcovFiles: string[] = await getLcovFiles()
  try {
    await createFolderIfNotExists(coverageDir)
    for (const lcovFile of lcovFiles) {
      await copyFile(
        lcovFile,
        `${coverageDir}/${parse(lcovFile).dir.split(sep).at(-2)}.lcov.info`,
      )
    }
    logger.info('Copied lcov.info files to root coverage directory')
  } catch (error) {
    logger.error('Error copying LCOV files:', error)
  }
}

/**
 * The function `mergeLcovFiles` merges multiple LCOV files into a single combined report.
 */
async function mergeLcovFiles(): Promise<void> {
  const lcovFiles: string[] = await getLcovFiles()
  try {
    for (const lcovFile of lcovFiles) {
      await processFile(lcovFile)
    }

    await createFolderIfNotExists(coverageDir)
    await writeFile(
      join(coverageDir, 'combined-lcov.info'),
      combinedReport.join('\n'),
    )
    logger.info('Combined LCOV report saved as combined-lcov.info')
  } catch (error) {
    logger.error('Error merging LCOV files:', error)
  }
}

;(async () => {
  await mergeLcovFiles()
  await copyLcovFilesToRootCoverageDir()
})()
