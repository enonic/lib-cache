var t = require('/lib/xp/testing.js');
var cacheLib = require('/lib/cache');

exports.testCache = function () {

    var cache = cacheLib.newCache({
        size: 100,
        expire: 10
    });

    t.assertEquals(0, cache.getSize());

    var numCalled = 0;
    var calcFunction = function () {
        numCalled++;

        return {
            num: numCalled,
            name: 'value' + numCalled
        };
    };

    var result = cache.get('key1', calcFunction);
    t.assertEquals(1, result.num);
    t.assertEquals('value1', result.name);
    t.assertEquals(1, cache.getSize());

    result = cache.get('key1', calcFunction);
    t.assertEquals(1, result.num);
    t.assertEquals('value1', result.name);
    t.assertEquals(1, cache.getSize());

    result = cache.get('key2', calcFunction);
    t.assertEquals(2, result.num);
    t.assertEquals('value2', result.name);
    t.assertEquals(2, cache.getSize());

    cache.clear();
    t.assertEquals(0, cache.getSize());

};

exports.testRemove = function () {

    var cache = cacheLib.newCache({
        size: 100,
        expire: 10
    });

    t.assertEquals(0, cache.getSize());

    var numCalled = 0;
    var calcFunction = function () {
        numCalled++;

        return {
            num: numCalled,
            name: 'value' + numCalled
        };
    };

    var result = cache.get('key1', calcFunction);
    t.assertEquals(1, result.num);
    t.assertEquals('value1', result.name);
    t.assertEquals(1, cache.getSize());

    cache.remove('key1');
    t.assertEquals(0, cache.getSize());
};

exports.testRemovePattern = function () {

    var cache = cacheLib.newCache({
        size: 100,
        expire: 10
    });

    t.assertEquals(0, cache.getSize());

    var numCalled = 0;
    var calcFunction = function () {
        numCalled++;

        return {
            num: numCalled,
            name: 'value' + numCalled
        };
    };

    cache.get('key1', calcFunction);
    cache.get('key2', calcFunction);
    cache.get('key3', calcFunction);
    cache.get('k1', calcFunction);
    cache.get('k2', calcFunction);

    t.assertEquals(5, cache.getSize());

    cache.removePattern('key.*');
    t.assertEquals(2, cache.getSize());
};