import { confirm, group, text } from '@clack/prompts'
import colors from 'picocolors'

export interface PkgsOptsType {
  path: symbol | string
  name: symbol | string
}

export const defaultPkgsOpts = {
  path: '',
  name: '',
}
export default async function main() {
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

        const shouldDefaultName = await confirm({
          message: `Do you want to create with default ${colors.cyan('packages')} name?`,
          initialValue: false,
        })
        if (!shouldDefaultName) {
          opts.name = await text({
            message: `What is your ${colors.cyan('packages')} name?`,
            placeholder: '',
            validate: (value: string) => {
              if (!value)
                return 'Please enter a name.'
              return void (0)
            },
          })
        }
        else {
          opts.name = 'packages'
        }
      },
    },
  )
}
