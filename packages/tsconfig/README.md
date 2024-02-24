# @templ/tsconfig

> Shared [TypeScript config](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html) for my projects

## `pm-x`

<!-- automd:pm-x args=. -->

```sh
# npm
npx @templ/tsconfig .

# pnpm
pnpm dlx @templ/tsconfig .

# bun
bunx @templ/tsconfig .
```

<!-- /automd -->

## `jsdocs`

<!-- automd:jsdocs -->

<!-- ⚠️  (jsdocs) Cannot read properties of undefined (reading 'startsWith') -->

<!-- /automd -->

## Usage

`tsconfig.json`

```json
{
  "extends": "@templ/tsconfig",
  "compilerOptions": {
    "outDir": "dist"
  }
}
```

When you are targeting a higher version of Node.js, check the relevant ECMAScript version and add it as `target`:

```json
{
  "extends": "@templ/tsconfig",
  "compilerOptions": {
    "outDir": "dist",
    "target": "ES2023"
  }
}
```

[GitHub](https://github.com/rjoydip/templ/tree/main/packages/tsconfig)
