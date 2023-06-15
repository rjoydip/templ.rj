import { existsSync, mkdirSync } from 'node:fs'

export const isJSONFile = (filename: string) => !!filename.endsWith('.json')
export const isMarkdownFile = (filename: string) => !!filename.endsWith('.md')
export const isMarkdownTemplateFile = (filename: string) => !!filename.endsWith('.tmpl.md')

export const isDataDirectoryExists = (directory: string) => existsSync(directory)
export const isOutputDirectoryExists = (directory: string) => existsSync(directory)
export const isTemplateDirectoryExists = (directory: string) => existsSync(directory)

export const createDirectory = (directory: string) => mkdirSync(directory)
