import { argv, cwd } from 'node:process'
import { join } from 'node:path'
import { consola } from 'consola'
import { deleteAsync } from 'del'
import colors from 'picocolors'
import parser from 'yargs-parser'
import { ignorePatterns } from '../utils'

async function main() {
  const { dryRun = false } = parser(argv.splice(2), {
    configuration: {
      'boolean-negation': false,
    },
  })

  const deletedPaths = await deleteAsync(['**/.turbo/**'], {
    ignore: ignorePatterns,
    cwd: join(cwd(), '..'),
    dryRun,
    force: true,
    absolute: false,
    onlyDirectories: true,
  })

  deletedPaths.length ? consola.box(`Deleted turbo folders:\n\n${deletedPaths.map(d => colors.green(d)).join('\n')}`) : consola.info('No turbo folder deleted')
}

main().catch(consola.error)
