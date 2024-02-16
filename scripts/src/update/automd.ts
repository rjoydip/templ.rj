import { parse, sep } from 'node:path'
import { automd } from 'automd'
import consola from 'consola'
import { globby } from 'globby'
import replaceString from 'replace-string'
import slash from 'slash'
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
      const { results } = await automd({
        dir,
      })

      return results.length ? results.map(i => i.output) : null
    }),
  )).filter(i => !!i).map(i => i && slash(replaceString(typeof i === 'object' ? i.join(' ') : i, slash(`${root}${sep}`), ''))).map(i => [i])

  consola.box(results.length ? table([['Markdown File Auto Update (README.md)'], ...results.map(r => Object.values(r))]) : 'No README.md found')
}

run().catch(consola.log)
