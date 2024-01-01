import { argv } from 'node:process'
import { group, log, note, outro } from '@clack/prompts'
import parser from 'yargs-parser'
import colors from 'picocolors'
import { getRootAsync } from '../utils'
import { defaultNamePrompt, installerPrompt, namePrompt, onCancelFn, packageManagerPrompt, pathPrompt, toolsPrompt } from './common'

async function main() {
  const { dryRun } = parser(argv.splice(2), {
    configuration: {
      'boolean-negation': false,
    },
  })
  const options = await group(
    {
      path: () => pathPrompt({
        name: 'docs',
      }),
      name: async () => {
        const confirmDefaultDocsName = await defaultNamePrompt({
          title: 'docs',
        })
        if (!confirmDefaultDocsName) {
          return await namePrompt({
            name: 'documentation',
          })
        }
        return 'docs'
      },
      tools: () => toolsPrompt({
        name: 'documentation',
        options: [
          { value: 'vitepress', label: 'Vitepress' },
          { value: 'nextra', label: 'Nextra' },
          { value: 'docusaurus', label: 'Docusaurus' },
          { value: 'nuxt', label: 'Nuxt' },
        ],
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
      options,
    })
    return
  }

  const root = await getRootAsync()

  const nextSteps = `cd ${root}        \n${options.install ? '' : options.manager === 'npm ' ? `npm install\n` : `${options.manager}`}${options.manager === 'npm' ? 'npm run dev' : `${options.manager} dev`}`

  note(nextSteps, 'Next steps.')

  log.success(`${colors.cyan(options.name)} package created`)
  outro('You all set')
}

main().catch(console.error)
