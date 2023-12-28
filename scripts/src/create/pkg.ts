import { cwd, exit } from 'node:process'
import { resolve } from 'node:path'
import colors from 'picocolors'
import cpy from 'cpy'
import replace from 'replace'
import latestVersion from 'latest-version'
import { cancel, confirm, group, intro, log, note, outro, select, spinner, text } from '@clack/prompts'

import {
  detectPackageManager,
  installDependencies,
} from 'nypm'

async function main() {
  intro('Package create')
  try {
    log.warn(colors.yellow(`Started package generate`))

    const project = await group(
      {
        path: () =>
          text({
            message: 'Where should we create your package?',
            placeholder: './',
            validate: (value: string) => {
              if (!value)
                return 'Please enter a path.'
              if (value[0] !== '.')
                return 'Please enter a relative path.'
              return void (0)
            },
          }),
        name: () =>
          text({
            message: 'What is your package name?',
            placeholder: '',
            validate: (value: string) => {
              if (!value)
                return 'Please enter a name.'
              return void (0)
            },
          }),
        packageManager: () =>
          select<any, string>({
            message: 'Select package manager.',
            options: [
              { value: 'pnpm', label: 'PNPM' },
              { value: 'npm', label: 'NPM' },
              { value: 'yarn', label: 'YARN' },
            ],
          }),
        install: () => confirm({
          message: 'Install dependencies?',
          initialValue: false,
        }),
      },
      {
        onCancel: () => {
          cancel('Operation cancelled.')
          exit(0)
        },
      },
    )

    const destDir = resolve(project.path, project.name)

    if (destDir)
      await cpy(`${resolve(cwd(), 'source')}/**`, destDir)

    replace({
      regex: '{name}',
      replacement: project.name,
      paths: [resolve(destDir, 'package.json'), resolve(destDir, 'README.md')],
      recursive: true,
      silent: true,
    })

    if (project.packageManager) {
      const pkgVersion = await latestVersion(project.packageManager)
      replace({
        regex: '"packageManager": ""',
        replacement: `"packageManager": "${project.packageManager.concat(`@${pkgVersion}`)}"`,
        paths: [resolve(destDir, 'package.json')],
        recursive: true,
        silent: true,
      })
    }

    if (project.install) {
      const _projectManager = await detectPackageManager(
        destDir,
      )

      if (_projectManager) {
        const s = spinner()
        const { name } = _projectManager
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

    const nextSteps = `cd ${destDir}        \n${project.install ? '' : project.packageManager === 'npm ' ? `npm install\n` : `${project.packageManager}`}${project.packageManager === 'npm' ? 'npm run dev' : `${project.packageManager} dev`}`

    note(nextSteps, 'Next steps.')

    log.success(`${colors.cyan(project.name)} package created`)
    outro('You all set')
  }
  catch (error) {
    log.error(String(error))
  }
}

main().catch(console.error)
