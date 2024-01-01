import { exit } from 'node:process'
import colors from 'picocolors'
import { cancel, confirm, select, text } from '@clack/prompts'

export async function packageManagerPrompt() {
  return select<any, string>({
    message: 'Select package manager.',
    options: [
      { value: 'pnpm', label: 'PNPM' },
      { value: 'npm', label: 'NPM' },
      { value: 'yarn', label: 'YARN' },
    ],
  })
}

export async function installerPrompt() {
  return confirm({
    message: 'Install dependencies?',
    initialValue: false,
  })
}

export async function namePrompt(ops: {
  name: string
  placeholder?: string
  validation_message?: string
} = {
  name: '',
  placeholder: '',
  validation_message: 'Please enter a name.',
}) {
  return text({
    message: `What is your ${colors.cyan(ops.name)} name?`,
    placeholder: ops.placeholder,
    validate: (value: string) => {
      if (!value)
        return ops.validation_message
      return void (0)
    },
  })
}

export async function pathPrompt(ops: {
  name: string
  placeholder?: string
  validation_message?: string
  validation_relative_path_message?: string
} = {
  name: '',
  placeholder: './',
  validation_message: 'Please enter a path.',
  validation_relative_path_message: 'Please enter a relative path.',
}) {
  return text({
    message: `Where should we create your ${colors.cyan(ops.name)}?`,
    placeholder: ops.placeholder,
    validate: (value: string) => {
      if (!value)
        return ops.validation_message
      if (value[0] !== '.')
        return ops.validation_relative_path_message
      return void (0)
    },
  })
}

export async function defaultNamePrompt(ops: {
  title: string
  initialValue?: boolean
} = {
  title: '',
  initialValue: false,
}) {
  return confirm({
    message: `Do you want to create with default ${colors.cyan(ops.title)} name?`,
    initialValue: ops.initialValue,
  })
}

export async function toolsPrompt(ops: {
  name: string
  options?: Array<{
    value: string
    label: string
  }>
} = {
  name: '',
  options: [],
}) {
  return select<any, string>({
    message: `Select ${ops.name} tools.`,
    options: ops.options,
  })
}

export function onCancelFn() {
  cancel('Operation cancelled.')
  exit(0)
}
