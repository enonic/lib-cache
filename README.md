# Cache Library for Enonic XP

[![Actions Status](https://github.com/enonic/lib-cache/workflows/Gradle%20Build/badge.svg)](https://github.com/enonic/lib-cache/actions)
[![codecov](https://codecov.io/gh/enonic/lib-cache/branch/master/graph/badge.svg)](https://codecov.io/gh/enonic/lib-cache)
[![License](https://img.shields.io/github/license/enonic/lib-cache.svg)](http://www.apache.org/licenses/LICENSE-2.0.html)

This library implements simple caching methods that can be used in your apps. See documentation
here: https://developer.enonic.com/docs/cache-library/master


## Building

To build this project, execute the following:

```
./gradlew clean build
```

## Publishing

To release this project, execute the following:

```
./gradlew clean build uploadArchives
```

## Documentation

Building the documentation is done executing the following:

```
./gradlew buildDoc
```

And publishing the docs to S3:

```
./gradlew publishDoc
```
