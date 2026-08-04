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

exports.testNamedShareSameName = function () {
    var cache1 = cacheLib.newCache({ name: 'shared', size: 100 });
    var cache2 = cacheLib.newCache({ name: 'shared', size: 100 });

    cache1.put('key1', { num: 42, name: 'answer' });

    var result = cache2.getIfPresent('key1');
    assert.assertNotNull(result);
    assert.assertEquals(42, result.num);
    assert.assertEquals('answer', result.name);
    assert.assertEquals(1, cache2.getSize());
};

exports.testNamedDifferentNamesIsolated = function () {
    var cacheA = cacheLib.newCache({ name: 'a', size: 100 });
    var cacheB = cacheLib.newCache({ name: 'b', size: 100 });

    cacheA.put('key1', 'valueA');

    assert.assertNull(cacheB.getIfPresent('key1'));
    assert.assertEquals(0, cacheB.getSize());
    assert.assertEquals('valueA', cacheA.getIfPresent('key1'));
};

exports.testUnnamedNotShared = function () {
    var cache1 = cacheLib.newCache({ size: 100 });
    var cache2 = cacheLib.newCache({ size: 100 });

    cache1.put('key1', 'value1');

    assert.assertNull(cache2.getIfPresent('key1'));
    assert.assertEquals('value1', cache1.getIfPresent('key1'));
};

exports.testNamedGetWithCallback = function () {
    var cache = cacheLib.newCache({ name: 'loader', size: 100 });

    var numCalled = 0;
    var calc = function () {
        numCalled++;
        return { num: numCalled, name: 'value' + numCalled };
    };

    var result = cache.get('key1', calc);
    assert.assertEquals(1, result.num);
    assert.assertEquals('value1', result.name);

    result = cache.get('key1', calc);
    assert.assertEquals(1, result.num);
    assert.assertEquals(1, numCalled);
    assert.assertEquals(1, cache.getSize());
};

exports.testNamedCopySemantics = function () {
    var cache = cacheLib.newCache({ name: 'copy', size: 100 });

    cache.put('key1', { num: 1, nested: { x: 1 }, list: [1, 2] });

    var first = cache.getIfPresent('key1');
    first.num = 999;
    first.nested.x = 999;
    first.list[0] = 999;

    var second = cache.getIfPresent('key1');
    assert.assertEquals(1, second.num);
    assert.assertEquals(1, second.nested.x);
    assert.assertEquals(1, second.list[0]);
};

exports.testUnnamedAcceptsAnyValue = function () {
    var cache = cacheLib.newCache({ size: 100 });

    cache.put('fn', function () {
        return 42;
    });
    cache.put('obj', { num: 1 });

    assert.assertEquals(2, cache.getSize());
    assert.assertNotNull(cache.getIfPresent('fn'));
    assert.assertEquals(1, cache.getIfPresent('obj').num);
};

exports.testNamedPutFunctionThrows = function () {
    var cache = cacheLib.newCache({ name: 'fn', size: 100 });

    assert.assertThrows(function () {
        cache.put('key1', function () {
            return 1;
        });
    });
};

exports.testNamedPutNestedFunctionThrows = function () {
    var cache = cacheLib.newCache({ name: 'fn-nested', size: 100 });

    assert.assertThrows(function () {
        cache.put('key1', { callback: function () {
            return 1;
        } });
    });
};