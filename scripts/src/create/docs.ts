import { confirm, group, select, text } from '@clack/prompts'
import colors from 'picocolors'

export interface DocsOptsType {
  path: symbol | string
  name: symbol | string
  type: symbol | string
  docusaurus: {
    language: symbol | string
    template: symbol | string
    git: {
      repo: symbol | string
    }
    local: {
      path: symbol | string
    }
  }
  nextra: {
    theme: symbol | string
  }
  vitepress: {
    cmd: symbol | string
  }
}

export const defaultDocsOpts = {
  path: '',
  name: '',
  type: '',
  docusaurus: {
    language: '',
    template: '',
    git: {
      repo: '',
    },
    local: {
      path: '',
    },
  },
  nextra: {
    theme: '',
  },
  vitepress: {
    cmd: '',
  },
}

export default async function main() {
  return await group(
    {
      docs: async () => {
        const opts: DocsOptsType = defaultDocsOpts

        const toolsOpts = await select<any, string>({
          message: 'Select tools/framework.',
          options: [
            { value: 'docusaurus', label: 'Docusaurus' },
            { value: 'nextra', label: 'Nextra' },
            { value: 'vitepress', label: 'Vitepress' },
          ],
          initialValue: 'next',
        })

        opts.type = toolsOpts

        if (toolsOpts === 'docusaurus') {
          const langOpts = await confirm({
            message: 'Would you like to use TypeScript?',
            initialValue: false,
          })

          opts[toolsOpts].language = langOpts ? 'typescript' : 'javascript'

          const templateOpts = await select<any, string>({
            message: 'Select a template below',
            options: [
              { value: 'classic', label: 'Classic (recommended)' },
              { value: 'git', label: 'Git repository' },
              { value: 'local', label: 'Local template' },
            ],
            initialValue: 'classic',
          })

          opts[toolsOpts].template = templateOpts

          if (templateOpts === 'git') {
            opts[toolsOpts].git.repo = await text({
              message: `Enter a repository URL from GitHub, Bitbucket, GitLab, or any other public repo.`,
              placeholder: 'https://github.com/ownerName/repoName.git',
              validate: (value: string) => {
                if (!value)
                  return 'Please enter a URL.'
                if (!value.startsWith('https://github.com') || !value.startsWith('https://bitbucket.org') || !value.startsWith('https://gitlab.com/') || !value.startsWith('https://'))
                  return 'Please enter a right repository URL (e.g. GitHub, Bitbucket, GitLab).'
                return void (0)
              },
            })
          }

          if (templateOpts === 'local') {
            opts[toolsOpts].local.path = await text({
              message: `Enter a local folder path, relative to the current working directory.`,
              placeholder: './',
              validate: (value: string) => {
                if (!value)
                  return 'Please enter a path.'
                if (value[0] !== '.')
                  return 'Please enter a relative path.'
                return void (0)
              },
            })
          }
        }

        if (toolsOpts === 'nextra') {
          const themeOpts = await select<any, string>({
            message: 'Select a theme first',
            options: [
              { value: 'docs', label: 'Documentation' },
              { value: 'blog', label: 'Blog' },
            ],
            initialValue: 'docs',
          })

          opts[toolsOpts].theme = themeOpts
        }

        if (toolsOpts === 'vitepress')
          opts[toolsOpts].cmd = 'vitepress init'

        if (toolsOpts === 'docusaurus' || toolsOpts === 'nextra') {
          opts.path = await text({
            message: `Where should we create your ${colors.cyan('docs')}?`,
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
            message: `Do you want to create with default ${colors.cyan('docs')} name?`,
            initialValue: false,
          })
          if (!shouldDefaultName) {
            opts.name = await text({
              message: `What is your ${colors.cyan('documentation')} name?`,
              placeholder: '',
              validate: (value: string) => {
                if (!value)
                  return 'Please enter a name.'
                return void (0)
              },
            })
          }
          else {
            opts.name = 'docs'
          }
        }

        return opts
      },
    },
  )
}
