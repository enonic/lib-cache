/**
 * Cache related functions.
 *
 * @example
 * var cacheLib = require('/lib/cache');
 *
 * @module cache
 */

/**
 * Creates a new cache with options.
 *
 * @param {*} native Native cache object.
 * @param {boolean} shared True for an application-wide (named) cache, false for a per-context (unnamed) cache.
 * @constructor
 * @private
 */
function Cache(native, shared) {
    this.cache = native;
    this.shared = shared;
}

/**
 * Returns value for cache entry if exists, otherwise it's calculated and put into the cache.
 *
 * For a named (shared) cache the value returned by the callback is copied into the cache as data.
 * See {@link module:cache.newCache} for the difference between named and unnamed caches.
 *
 * @param {string} key Cache key to use.
 * @param {function} callback Callback to a function that can calculate the cache value.
 * @returns {*} Cache value for key.
 */
Cache.prototype.get = function (key, callback) {
    var result = this.shared
        ? this.cache.get(key, __.toScriptValue(callback))
        : this.cache.get(key, callback);
    return __.toNativeObject(result);
};

/**
 * Returns value for cache entry if exists, otherwise it returns null.
 *
 * @param {string} key Cache key to use.
 * @returns {*} Cache value for key.
 */
Cache.prototype.getIfPresent = function (key) {
    var result = this.cache.getIfPresent(key);
    return __.toNativeObject(result);
};

/**
 * Puts the value into the cache with the provided key.
 *
 * **Important — the value contract depends on whether the cache is named** (see {@link module:cache.newCache}):
 *
 * - **Unnamed cache:** objects are cached *by reference*. If you modify an object after storing it,
 *   or modify an object retrieved from the cache, those modifications could affect the cached object.
 *   Deep clone after retrieval if the value must be changed. Any value can be cached.
 * - **Named cache:** the value is *copied* as data on put (and again on get). Only data is accepted:
 *   functions, host objects and cyclic structures throw an error here rather than being cached.
 *   Adding a `name` to an existing cache therefore silently changes the semantics from by-reference
 *   to copy, and may start throwing on a value that used to cache fine.
 *
 * @param {string} key Cache key to use.
 * @param {Object} value Value to store in the cache.
 */
Cache.prototype.put = function (key, value) {
    if (this.shared) {
        this.cache.put(key, __.toScriptValue(value));
    } else {
        this.cache.put(key, value);
    }
};

/**
 * Clears the cache.
 */
Cache.prototype.clear = function () {
    this.cache.clear();
};

/**
 * Returns number of elements in cache.
 *
 * For an unnamed cache on a pooled engine this counts only the entries in the calling context's cache.
 *
 * @returns {number} Returns the number of elements that are currently in the cache.
 */
Cache.prototype.getSize = function () {
    return this.cache.getSize();
};

/**
 * Removes an entry, identified by its key, from the cache.
 *
 * If the key is not found in the cache, no changes are made.
 *
 * @param {string} key Cache key to remove.
 */
Cache.prototype.remove = function (key) {
    return this.cache.remove(key);
};

/**
 * Removes multiple entries, identified by a regular expression, from the cache.
 *
 * If the regex pattern does not match with any existing key, no changes are made.
 *
 * @param {string} keyRegex Regular expression pattern to match with keys to be removed.
 */
Cache.prototype.removePattern = function (keyRegex) {
    return this.cache.removePattern(keyRegex);
};

/**
 * Creates a new cache.
 *
 * There are two kinds of cache, and **naming a cache changes its value semantics** — read this before
 * adding a `name` to an existing cache:
 *
 * - **Unnamed** (no `name` option) — one cache *per script context*. On a pooled engine the same
 *   `newCache` call at module level yields one cache in each context, so entries created in one
 *   context miss in the others, `size` bounds *each* context's cache and `getSize()` counts only the
 *   calling context's entries. Values are cached *by reference* at no copy cost, and any value can be
 *   stored. This is the original behaviour and is unchanged.
 * - **Named** (`name` option set) — one cache *per application*, shared by every context. The same
 *   name returns the same cache; different names are different caches. Because a cached value may
 *   outlive the context that produced it, values are stored as *data*: each `put` copies the value in
 *   and each `get`/`getIfPresent` copies it out, so mutating a retrieved value never affects the
 *   cached entry, and functions, host objects and cyclic structures throw at `put` instead of being
 *   cached. Adding a `name` to a previously unnamed cache therefore switches it from by-reference to
 *   copy semantics and may start throwing on a value that cached fine before.
 *
 * A named cache is cleared when its application is stopped, uninstalled or reconfigured. It is *not*
 * cleared on a dev-mode script reload, and if `expire` is not set its entries live until one of those
 * events occurs.
 *
 * @example-ref examples/cache/newCache.js
 * @example-ref examples/cache/httpCache.js
 *
 * @param {object} options Cache options as JSON.
 * @param {string} [options.name] If set, creates an application-wide cache shared by all contexts under this name (see above).
 * @param {number} options.size Maximum number of elements in the cache.
 * @param {number} options.expire Expire time (in sec) for cache entries. If not set, it will never expire.
 * @returns {Cache} Returns a new cache instance.
 */
exports.newCache = function (options) {
    if (options.name) {
        const shared = __.newBean('com.enonic.lib.cache.SharedCacheBean');
        shared.setName(options.name);

        if (options.size) {
            shared.setSize(options.size);
        }

        if (options.expire) {
            shared.setExpire(options.expire);
        }

        shared.build();
        return new Cache(shared, true);
    }

    const builder = __.newBean('com.enonic.lib.cache.CacheBeanBuilder');

    if (options.size) {
        builder.setSize(options.size);
    }

    if (options.expire) {
        builder.setExpire(options.expire);
    }

    const cache = builder.build();
    return new Cache(cache, false);
};
