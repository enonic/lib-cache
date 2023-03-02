var assert = require('/lib/xp/testing');
var cacheLib = require('/lib/cache');

exports.testCache = function () {

    var cache = cacheLib.newCache({
        size: 100,
        expire: 10
    });

    assert.assertEquals(0, cache.getSize());

    var numCalled = 0;
    var calcFunction = function () {
        numCalled++;

        return {
            num: numCalled,
            name: 'value' + numCalled
        };
    };

    var result = cache.get('key1', calcFunction);
    assert.assertEquals(1, result.num);
    assert.assertEquals('value1', result.name);
    assert.assertEquals(1, cache.getSize());

    result = cache.get('key1', calcFunction);
    assert.assertEquals(1, result.num);
    assert.assertEquals('value1', result.name);
    assert.assertEquals(1, cache.getSize());

    result = cache.get('key2', calcFunction);
    assert.assertEquals(2, result.num);
    assert.assertEquals('value2', result.name);
    assert.assertEquals(2, cache.getSize());

    cache.clear();
    assert.assertEquals(0, cache.getSize());

};

exports.testGetIfPresent = function(){
    var cache = cacheLib.newCache({
        size: 100,
        expire: 10
    });
    assert.assertEquals(null, cache.getIfPresent('key1'));
};

exports.testPut = function(){

    var cache = cacheLib.newCache({
        size: 100,
        expire: 10
    });

    cache.put('key1', 5);

    var getKey1 = cache.get('key1', function(){
        return 4;
    });

    assert.assertEquals(5, getKey1);
}

exports.testRemove = function () {

    var cache = cacheLib.newCache({
        size: 100,
        expire: 10
    });

    assert.assertEquals(0, cache.getSize());

    var numCalled = 0;
    var calcFunction = function () {
        numCalled++;

        return {
            num: numCalled,
            name: 'value' + numCalled
        };
    };

    var result = cache.get('key1', calcFunction);
    assert.assertEquals(1, result.num);
    assert.assertEquals('value1', result.name);
    assert.assertEquals(1, cache.getSize());

    cache.remove('key1');
    assert.assertEquals(0, cache.getSize());
};

exports.testRemovePattern = function () {

    var cache = cacheLib.newCache({
        size: 100,
        expire: 10
    });

    assert.assertEquals(0, cache.getSize());

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

    assert.assertEquals(5, cache.getSize());

    cache.removePattern('key.*');
    assert.assertEquals(2, cache.getSize());
};