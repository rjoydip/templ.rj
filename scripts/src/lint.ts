import { $ } from 'execa'

async function main() {
  const eslint = await $`eslint --color --cache --fix --cache-location .eslintcache .`
  console.log(eslint.stdout)
  const lintMd = await $`esno ./src/lint-md.ts`
  console.log(lintMd.stdout)
  const secretlint = await $`secretlint --secretlintignore .gitignore \"**/*\"`
  console.log(secretlint.stdout)
  const sizeLimit = await $`size-limit`
  console.log(sizeLimit.stdout)
  const cspell = await $`cspell .`
  console.log(cspell.stdout)
  const knip = await $`pnpm knip --no-gitignore --no-exit-code`
  console.log(knip.stdout)
}

main().catch(console.error)
