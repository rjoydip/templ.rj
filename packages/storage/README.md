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

### `clearStorage(type)`

Clear the specified type of storage.

### `confStore(opts?)`

Creates a storage with the given options and returns a storage with the prefix 'conf'.

### `createStore(opts?)`

Creates a storage with the given options.

### `decoder()`


### `encoder()`


### `envStore(opts?)`

Create a storage with the given options and return a prefixed storage with the 'conf' prefix.

### `ffStore(opts?)`

Creates a storage environment using the provided options and returns a prefixed storage.

### `getConf(key)`

Retrieve a configuration value from the storage.

### `getEnv(key)`

Retrieves the value of the specified environment variable from the storage using the provided options.

### `getFF(key)`

Retrieves an item from the storage with the given key using the specified options.

### `isValid(data, schema)`

Validates the provided data against the given schema.

### `setConf(key, value)`

Store the given key-value pair in the configuration storage.

### `setEnv(key, value)`

Store the given key-value pair in the environment storage.

### `setFF(key, value)`

Set a feature flag in the storage.

### `setOptions(opts)`

Sets the options for creating storage.


<!-- /automd -->

[GitHub](https://github.com/rjoydip/templ/tree/main/packages/storage)
