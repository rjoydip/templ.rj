import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import mustache from 'mustache'
import glob from 'tiny-glob'

export function isJSONFile(filename: string) {
  return !!filename.endsWith('.json')
}

export function isMarkdownFile(filename: string) {
  return !!filename.endsWith('.md')
}

export function isMarkdownTemplateFile(filename: string) {
  return !!filename.endsWith('.tmpl.md')
}

export function isDataDirectoryExists(directory: string) {
  return existsSync(directory)
}

export function isOutputDirectoryExists(directory: string) {
  return existsSync(directory)
}

export function isTemplateDirectoryExists(directory: string) {
  return existsSync(directory)
}

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

export function generateOutput(template: string, data: any): string {
  return mustache.render(template, data)
}
