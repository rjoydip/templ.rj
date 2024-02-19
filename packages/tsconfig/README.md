# @templ/tsconfig

> Shared [TypeScript config](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html) for my projects

## `pm-x`

<!-- automd:pm-x args=. -->

```sh
# npm
npx @templ/tsconfig@0.0.1 .

# pnpm
pnpm dlx @templ/tsconfig@0.0.1 .

# bun
bunx @templ/tsconfig@0.0.1 .
```

<!-- /automd -->

## `jsdocs`

<!-- automd:jsdocs -->

<!-- ⚠️  (jsdocs) Cannot find module 'C:/Users/rjoydip/codebase/templ/packages/tsconfig/src/index'
Require stack:
- C:\Users\rjoydip\codebase\templ\scripts\index.js -->

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
