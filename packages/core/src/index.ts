import { readFile, writeFile } from 'fs/promises'
import mustache from 'mustache'
import glob from 'tiny-glob'

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
  return extension !== '' && fileName
    ? (await readFile(`${directory}/${fileName}${extension}`)).toString()
    : null
}

export function generateOutput(
  template: string,
  data: any): string {
  return mustache.render(template, data)
}

export async function writeOutput(directory: string,
  fileName: string,
  extension: string,
  data: any) {
  return await writeFile(`${directory}/${fileName}${extension}`, data)
}
