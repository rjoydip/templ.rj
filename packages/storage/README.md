# @templ/storage

TEMPL storage module.

## `pm-x`

<!-- automd:pm-x args=. -->

```sh
# npm
npx @templ/storage@0.0.1 .

# pnpm
pnpm dlx @templ/storage@0.0.1 .

# bun
bunx @templ/storage@0.0.1 .
```

<!-- /automd -->

## `jsdocs`

<!-- automd:jsdocs -->

### `getStorage(options)`

Retrieves the appropriate storage based on the provided options.

### `getStorageInstance(options)`

Retrieves the storage instance.

### `getStorageOption()`

Get the storage option.

### `isValid(data, schema)`

Validates the provided data against the given schema.

### `retriveConf(key, opts?)`

Retrieve a configuration value from the storage.

### `retriveEnv(key, opts?)`

Retrieves the value of the specified environment variable from the storage using the provided options.

### `retriveFF(key, opts?)`

Retrieves an item from the storage with the given key using the specified options.

### `setStorageOption(opts)`

Set the store option with the given options.

### `storeConf(key, value, opts?)`

Store the given key-value pair in the configuration storage.

### `storeEnv(key, value, opts?)`

Store the given key-value pair in the environment storage.

### `storeFF(key, value, opts?)`

Asynchronously stores the given key-value pair in the storage with the option to provide additional storage options.

<!-- /automd -->

[GitHub](https://github.com/rjoydip/templ/tree/main/packages/storage)
