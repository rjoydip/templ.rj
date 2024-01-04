import { confirm, group, select, text } from '@clack/prompts'
import { BITBUCKET_HOST, GITHUB_HOST, GITLAB_HOST, PROTOCOL } from '../utils/constant'

/* enum LangEnum {
  js = 'js',
  ts = 'ts',
} */

export interface CustomOptsType {
  language: symbol | string
  template: symbol | string
  git: {
    repo: symbol | string
  }
  local: {
    path: symbol | string
  }
}

export const defaultCustomOpts = {
  language: 'js',
  template: '',
  git: {
    repo: '',
  },
  local: {
    path: '',
  },
}

export default async function init() {
  return await group(
    {
      custom: async () => {
        const opts: CustomOptsType = defaultCustomOpts

        const langOpts = await confirm({
          message: 'Would you like to use TypeScript?',
          initialValue: false,
        })

        opts.language = langOpts ? 'ts' : 'js'

        const templateOpts = await select<any, string>({
          message: 'Select a template below',
          options: [
            { value: 'git', label: 'Git repository' },
            { value: 'local', label: 'Local template' },
          ],
          initialValue: 'local',
        })

        opts.template = templateOpts

        if (templateOpts === 'git') {
          opts.git.repo = await text({
            message: `Enter a repository URL from GitHub, Bitbucket, GitLab, or any other public repo.`,
            placeholder: `${PROTOCOL}://github.com/ownerName/repoName.git`,
            validate: (value: string) => {
              if (!value)
                return 'Please enter a URL.'
              if (!value.startsWith(`${PROTOCOL}://${GITHUB_HOST}`) || !value.startsWith(`${PROTOCOL}://${BITBUCKET_HOST}`) || !value.startsWith(`${PROTOCOL}://${GITLAB_HOST}/`) || !value.startsWith(`${PROTOCOL}://`))
                return 'Please enter a right repository URL (e.g. GitHub, Bitbucket, GitLab).'
              return void (0)
            },
          })
        }

        if (templateOpts === 'local') {
          opts.local.path = await text({
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

        return opts
      },
    },
  )
}
