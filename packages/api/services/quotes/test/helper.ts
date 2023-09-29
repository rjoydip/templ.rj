import { join } from 'node:path'
import { readFile } from 'node:fs/promises'
import { buildServer } from '@platformatic/service'

export async function getServer() {
  // We go up two folder because this files executes in the dist folder
  const config = JSON.parse(await readFile(join(__dirname, '..', '..', 'platformatic.service.json'), 'utf8'))
  // Add your config customizations here. For example you want to set
  // all things that are set in the config file to read from an env variable
  config.server.logger.level = 'warn'
  config.watch = false

  // Add your config customizations here
  return await buildServer(config)
}
