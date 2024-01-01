import { argv } from 'node:process'
import { resolve } from 'node:path'
import colors from 'picocolors'
import cpy from 'cpy'
import replace from 'replace'
import latestVersion from 'latest-version'
import { group, intro, log, note, outro, spinner } from '@clack/prompts'
import {
  detectPackageManager,
  installDependencies,
} from 'nypm'
import parser from 'yargs-parser'
import { getRootAsync } from '../utils'
import { installerPrompt, namePrompt, onCancelFn, packageManagerPrompt, pathPrompt } from './common'

async function main() {
  intro('Package create')
  log.warn(colors.yellow(`Started package generate`))

  const { dryRun } = parser(argv.splice(2), {
    configuration: {
      'boolean-negation': false,
    },
  })

  const $package = await group(
    {
      path: () => pathPrompt({
        name: 'package',
      }),
      name: () => namePrompt({
        name: 'package',
      }),
      manager: () => packageManagerPrompt(),
      install: () => installerPrompt(),
    },
    {
      onCancel: () => onCancelFn(),
    },
  )

  if (dryRun) {
    console.log({
      title: 'docs',
      $package,
    })
    return
  }

  const root = await getRootAsync()
  const destDir = resolve(root, $package.path, $package.name)

  if (destDir)
    await cpy(`${resolve(root, 'templates', 'basic')}/**`, destDir)

  replace({
    regex: 'basic',
    replacement: $package.name,
    paths: [resolve(destDir, 'package.json'), resolve(destDir, 'README.md')],
    recursive: true,
    silent: true,
  })

  if ($package.manager) {
    const pkgVersion = await latestVersion($package.manager)
    replace({
      regex: '"packageManager": ""',
      replacement: `"packageManager": "${$package.manager.concat(`@${pkgVersion}`)}"`,
      paths: [resolve(destDir, 'package.json')],
      recursive: true,
      silent: true,
    })
  }

  if ($package.install) {
    const $packageManager = await detectPackageManager(
      destDir,
    )

    if ($packageManager) {
      const s = spinner()
      const { name } = $packageManager
      s.start(`Installing via ${name}`)
      await installDependencies({
        cwd: destDir,
        packageManager: {
          name,
          command: name === 'npm' ? 'npm install' : `${name}`,
        },
        silent: true,
      })
      s.stop(`Installed via ${name}`)
    }
  }

  const nextSteps = `cd ${destDir}        \n${$package.install ? '' : $package.manager === 'npm ' ? `npm install\n` : `${$package.manager}`}${$package.manager === 'npm' ? 'npm run dev' : `${$package.manager} dev`}`

  note(nextSteps, 'Next steps.')

  log.success(`${colors.cyan($package.name)} package created`)
  outro('You all set')
}

main().catch(console.error)
