import { readFile } from 'node:fs/promises'
import glob from 'tiny-glob'

export async function getTemplateFiles(directory: string, extension: string) {
  return await getFiles(directory, extension)
}

export async function getFiles(directory: string, extension: string) {
  return await glob(`*${extension}`, {
    cwd: directory,
  })
}

export async function getData(
  directory: string,
  fileName: string,
  extension = '',
) {
  /* prettier-ignore */
  return extension !== '' && fileName !== ''
    ? (await readFile(`${directory}/${fileName}${extension}`)).toString() : null
}
