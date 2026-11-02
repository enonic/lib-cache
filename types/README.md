# Types for Cache library

Type definitions for the [Enonic XP Cache library](https://github.com/enonic/lib-cache).

## Install

```bash
npm i --save-dev @enonic-types/lib-cache
```

## Setup

Add lib-cache to `compilerOptions.paths` in the `tsconfig.json` file used for your application's server-side TypeScript code:

```json
{
  "compilerOptions": {
    "paths": {
      "/lib/cache": ["./node_modules/@enonic-types/lib-cache"]
    }
  }
}
```

## Use

```ts
import {newCache} from '/lib/cache';

const cache = newCache({
    size: 100,
    expire: 3600,
});

export function get() {
    const value = cache.get('my-key', () => {
        return {
            computed: true,
        };
    });

    return {
        body: value,
        contentType: 'application/json',
    };
}
```

All imports from `/lib/cache` should now be typed.

## API

### `newCache(options: CacheOptions): Cache`

Creates a new cache instance.

### `CacheOptions`

| Property | Type     | Description                                                                   |
|----------|----------|-------------------------------------------------------------------------------|
| `size`   | `number` | Maximum number of elements in the cache. If not set, the cache is unbounded.  |
| `expire` | `number` | Expire time (in seconds) for cache entries. If not set, entries never expire. |

### `Cache`

| Method                                      | Description                                                                                                           |
|---------------------------------------------|-----------------------------------------------------------------------------------------------------------------------|
| `get<A>(key: string, callback: () => A): A` | Returns the value for `key` if it exists; otherwise invokes `callback`, stores its result and returns it.             |
| `getIfPresent<A>(key: string): A \| null`   | Returns the value for `key` if it exists; otherwise returns `null`.                                                   |
| `put(key: string, value: unknown): void`    | Puts `value` into the cache under `key`. Objects are cached by reference, so deep clone after retrieval if mutating.  |
| `remove(key: string): void`                 | Removes the entry identified by `key`. No changes are made if the key is not found.                                   |
| `removePattern(keyRegex: string): void`     | Removes all entries whose keys match the regular expression `keyRegex`. No changes are made if nothing matches.       |
| `clear(): void`                             | Clears the cache.                                                                                                     |
| `getSize(): number`                         | Returns the number of elements currently in the cache.                                                                |

## Documentation

[Cache library](https://developer.enonic.com/docs/cache-library)
