import { parse, sep } from 'node:path'
import { automd } from 'automd'
import consola from 'consola'
import { globby } from 'globby'
import { table } from 'table'
import { ignorePatterns, root } from '../utils'

async function run() {
  const mdFiles = await globby(['**/*README.md'], {
    ignore: ignorePatterns,
    absolute: true,
    cwd: root,
  })

  const results = (await Promise.all(
    mdFiles.map(async (f) => {
      const dir = parse(f).dir
      const { config, updates } = await automd({
        dir,
        file: 'README.md',
      })
      return updates.length ? config.dir : null
    }),
  )).filter(i => !!i).map(i => i && i.replace(`${root}${sep}`, '')).map(i => [i])

  consola.box(results.length ? table([['Markdown File Auto Update (README.md)'], ...results.map(r => Object.values(r))]) : 'No README.md found')
}

run().catch(consola.log)
