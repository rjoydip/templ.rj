import { confirm, group, select, text } from '@clack/prompts'
import colors from 'picocolors'

export interface PkgsOptsType {
  path: symbol | string
  template: symbol | string
  remote: {
    hostname: symbol | string
    repo: symbol | string
  }
  local: {
    name: symbol | string
    language: symbol | string
  }
}

export const defaultPkgsOpts = {
  path: '',
  template: '',
  remote: {
    hostname: '',
    repo: '',
  },
  local: {
    name: '',
    language: '',
  },
}

export default async function init() {
  return await group(
    {
      pkg: async () => {
        const opts: PkgsOptsType = defaultPkgsOpts
        opts.path = await text({
          message: `Where should we create your ${colors.cyan('packages')}?`,
          placeholder: './',
          validate: (value: string) => {
            if (!value)
              return 'Please enter a path.'
            if (value[0] !== '.')
              return 'Please enter a relative path.'
            return void (0)
          },
        })

        const templateOpts = await select<any, string>({
          message: 'Select a host below',
          options: [
            { value: 'bitbucket', label: 'Bitbucket' },
            { value: 'github', label: 'Github' },
            { value: 'gitlab', label: 'Gitlab' },
            { value: 'local', label: 'Local' },
          ],
          initialValue: 'local',
        })

        opts.template = (templateOpts === 'github' || templateOpts === 'gitlab' || templateOpts === 'bitbucket') ? 'remote' : templateOpts

        if (opts.template === 'remote') {
          opts.remote.hostname = templateOpts
          opts.remote.repo = await text({
            message: `Enter a repository URL.`,
            placeholder: `ownerName/repoName`,
            validate: (value: string) => {
              if (!value)
                return 'Please enter a URL.'
              return void (0)
            },
          })
        }

        if (templateOpts === 'local') {
          const langOpts = await confirm({
            message: 'Would you like to use TypeScript?',
            initialValue: false,
          })

          opts.local.language = langOpts ? 'ts' : 'js'

          opts.local.name = await text({
            message: `What is your ${colors.cyan('packages')} name?`,
            placeholder: '',
            validate: (value: string) => {
              if (!value)
                return 'Please enter a name.'
              return void (0)
            },
          })
        }
      },
    },
  )
}
