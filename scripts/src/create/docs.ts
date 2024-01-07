import { confirm, group, select, text } from '@clack/prompts'
import colors from 'picocolors'

export interface DocsOptsType {
  docusaurus: {
    name: symbol | string
    path: symbol | string
    language: symbol | string
    theme: symbol | string
    gitStrategy: symbol | string
  }
  tools: symbol | string
  nextra: {
    name: symbol | string
    path: symbol | string
    theme: symbol | string
  }
}

export const defaultDocsOpts = {
  docusaurus: {
    name: '',
    path: '',
    language: 'js',
    theme: 'docs',
    gitStrategy: '',
  },
  tools: '',
  nextra: {
    name: '',
    path: '',
    theme: '',
  },
}

export default async function init() {
  return await group(
    {
      docs: async () => {
        const opts: DocsOptsType = defaultDocsOpts

        const toolsOpts = await select<any, string>({
          message: 'Select tools/framework.',
          options: [
            { value: 'docusaurus', label: 'Docusaurus' },
            { value: 'nextra', label: 'Nextra' },
          ],
          initialValue: 'nextra',
        })

        opts.tools = toolsOpts

        if (toolsOpts === 'docusaurus' || toolsOpts === 'nextra') {
          if (toolsOpts === 'nextra') {
            const themeOpts = await select<any, string>({
              message: 'Select a theme first',
              options: [
                { value: 'docs', label: 'Documentation' },
                { value: 'blog', label: 'Blog' },
                { value: 'swr', label: 'SWR' },
              ],
              initialValue: 'docs',
            })

            opts[toolsOpts].theme = themeOpts
          }

          opts[toolsOpts].path = await text({
            message: `Where should we create your ${colors.cyan(opts[toolsOpts].theme.toString())}?`,
            placeholder: './',
            validate: (value: string) => {
              if (!value)
                return 'Please enter a path.'
              if (value[0] !== '.')
                return 'Please enter a relative path.'
              return void (0)
            },
          })

          const shouldDefaultName = await confirm({
            message: `Do you want to create with default ${colors.cyan(opts[toolsOpts].theme.toString())} name?`,
            initialValue: false,
          })
          if (!shouldDefaultName) {
            opts[toolsOpts].name = await text({
              message: `What is your ${colors.cyan(opts[toolsOpts].theme.toString())} name?`,
              placeholder: '',
              validate: (value: string) => {
                if (!value)
                  return 'Please enter a name.'
                return void (0)
              },
            })
          }
          else {
            opts[toolsOpts].name = opts[toolsOpts].theme.toString()
          }

          if (toolsOpts === 'docusaurus') {
            const langOpts = await confirm({
              message: 'Would you like to use TypeScript?',
              initialValue: false,
            })

            opts[toolsOpts].language = langOpts ? 'typescript' : 'javascript'

            const gitStrategyOpts = await select<any, string>({
              message: 'Select a theme first',
              options: [
                { value: 'deep', label: 'Preserve full history' },
                { value: 'shallow', label: 'Clone with --depth=1' },
                { value: 'copy', label: 'Shallow clone', hints: 'Not create a git repo' },
                { value: 'custom', label: 'Enter your custom git clone command', hints: 'We will prompt you for it' },
              ],
              initialValue: 'custom',
            })

            opts[toolsOpts].gitStrategy = gitStrategyOpts
          }
        }

        return opts
      },
    },
  )
}
