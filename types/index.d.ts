declare module "/lib/cache" {
    export interface CacheOptions {
        /**
         * Maximum number of elements in the cache. If not set, the cache is unbounded.
         */
        size?: number;

        /**
         * Expire time (in seconds) for cache entries. If not set, entries never expire.
         */
        expire?: number;
    }

    export interface Cache {
        /**
         * Returns value for cache entry if it exists; otherwise the callback is invoked, its result is stored and returned.
         *
         * @param key Cache key to use.
         * @param callback Function that computes the value if the key is not present in the cache.
         * @returns Cache value for key.
         */
        get<A>(key: string, callback: () => A): A;

        /**
         * Returns value for cache entry if it exists; otherwise returns null.
         *
         * @param key Cache key to use.
         * @returns Cache value for key, or null if not present.
         */
        getIfPresent<A>(key: string): A | null;

        /**
         * Puts the value into the cache with the provided key.
         *
         * Objects are cached by reference: modifying an object after storing it, or modifying an object retrieved from
         * the cache, could affect the cached value. Deep clone after retrieval if the value must be changed.
         *
         * @param key Cache key to use.
         * @param value Value to store in the cache.
         */
        put(key: string, value: unknown): void;

        /**
         * Clears the cache.
         */
        clear(): void;

        /**
         * Returns the number of elements currently in the cache.
         */
        getSize(): number;

        /**
         * Removes an entry, identified by its key, from the cache.
         *
         * If the key is not found in the cache, no changes are made.
         *
         * @param key Cache key to remove.
         */
        remove(key: string): void;

        /**
         * Removes multiple entries, identified by a regular expression, from the cache.
         *
         * If the regex pattern does not match any existing key, no changes are made.
         *
         * @param keyRegex Regular expression pattern to match with keys to be removed.
         */
        removePattern(keyRegex: string): void;
    }

    /**
     * Creates a new cache.
     *
     * @param options Cache options.
     * @returns A new cache instance.
     */
    export function newCache(options: CacheOptions): Cache;
}

export {};
