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
 * @constructor
 * @private
 */
function Cache(native) {
    this.cache = native;
}

/**
 * Returns value for cache entry if exists, otherwise it's calculated and put into the cache.
 *
 * **Important:** Objects are cached by reference. If you retrieve an object from the cache and modify it,
 * those modifications will affect the cached object. If you need immutability, consider deep cloning
 * the returned object (e.g., using `JSON.parse(JSON.stringify(obj))` for simple objects).
 *
 * @param {string} key Cache key to use.
 * @param {function} callback Callback to a function that can calculate the cache value.
 * @returns {*} Cache value for key.
 */
Cache.prototype.get = function (key, callback) {
    var result = this.cache.get(key, callback);
    return __.toNativeObject(result);
};

/**
 * Returns value for cache entry if exists, otherwise it returns null.
 *
 * **Important:** Objects are cached by reference. If you retrieve an object from the cache and modify it,
 * those modifications will affect the cached object. If you need immutability, consider deep cloning
 * the returned object (e.g., using `JSON.parse(JSON.stringify(obj))` for simple objects).
 *
 * @param {string} key Cache key to use.
 * @returns {*} Cache value for key.
 */
Cache.prototype.getIfPresent = function (key) {
    var result = this.cache.getIfPresent(key);
    return __.toNativeObject(result);
};

/**
 * Puts the value into the cache with the provided key
 *
 * @param {string} key Cache key to use.
 * @param {Object} value Value to store in the cache.
 */
Cache.prototype.put = function (key, value){
    this.cache.put(key, value);
}

/**
 * Clears the cache.
 */
Cache.prototype.clear = function () {
    this.cache.clear();
};

/**
 * Returns number of elements in cache.
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
 * @example-ref examples/cache/newCache.js
 * @example-ref examples/cache/httpCache.js
 *
 * @param {object} options Cache options as JSON.
 * @param {number} options.size Maximum number of elements in the cache.
 * @param {number} options.expire Expire time (in sec) for cache entries. If not set, it will never expire.
 * @returns {Cache} Returns a new cache instance.
 */
exports.newCache = function (options) {
    const builder = __.newBean('com.enonic.lib.cache.CacheBeanBuilder');

    if (options.size) {
        builder.setSize(options.size);
    }

    if (options.expire) {
        builder.setExpire(options.expire);
    }

    const cache = builder.build();
    return new Cache(cache);
};
