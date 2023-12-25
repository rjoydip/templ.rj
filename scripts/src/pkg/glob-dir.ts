import { join } from 'node:path'
import type { Config } from '@pnpm/config'
import { getConfig } from '@pnpm/config'

interface GlobalDirectory {
  /**
  The directory with globally installed packages.
  Equivalent to `pnpm root --global`.
   */
  packages: string
  /**
  The directory with globally installed binaries.
  Equivalent to `pnpm bin --global`.
   */
  binaries: string
  /**
  The directory with directories for packages and binaries. You probably want either of the above.
  Equivalent to `pnpm prefix --global`.
   */
  prefix: string
}

interface GlobalDirectoryType {
  /**
  Get the directory of globally installed packages and binaries.
  @example
  ```
  import { getGlobalDirectory } from './global-directory';
  const globalDirectory = await getGlobalDirectory()
  console.log(globalDirectory.pnpm.prefix);
  //=> '/usr/local'
  console.log(globalDirectory.pnpm.packages);
  //=> '/usr/local/lib/node_modules'
  ```
   */
  pnpm: GlobalDirectory
}

export async function getGlobalDirectory(): Promise<GlobalDirectoryType> {
  const { config }: { config: Config & { prefix?: string } } = await getConfig({
    cliOptions: {
      global: true,
    },
    packageManager: {
      name: 'pnpm',
      version: '0.0.0',
    },
  })

  return {
    pnpm: {
      prefix: config?.prefix || '',
      packages: join(config.dir, 'node_modules'),
      binaries: config.bin,
    },
  }
}
