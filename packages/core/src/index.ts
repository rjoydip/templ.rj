import { readFile } from 'fs/promises'
import mustache from 'mustache'
import glob from 'tiny-glob'

export * from './utils'
export * from './constants'

export async function getTemplateFiles(directory: string, extension: string) {
  return await getFiles(directory, extension)
}

export async function getFiles(directory: string, extension: string) {
  return await glob(`*${extension}`, {
    cwd: directory,
  })
}

export async function getData(directory: string,
  fileName: string,
  extension = '') {
  return extension !== '' && fileName !== ''
    ? (await readFile(`${directory}/${fileName}${extension}`)).toString()
    : null
}

export function generateOutput(
  template: string,
  data: any): string {
  return mustache.render(template, data)
}
