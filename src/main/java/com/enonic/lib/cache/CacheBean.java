package com.enonic.lib.cache;

import java.util.concurrent.Callable;
import java.util.regex.Pattern;
import java.util.stream.Stream;

import com.google.common.cache.Cache;

public final class CacheBean
{
    private final Cache<String, Object> cache;

    public CacheBean( final Cache<String, Object> cache )
    {
        this.cache = cache;
    }

    public Object get( final String key, final Callable<Object> callback )
        throws Exception
    {
        return this.cache.get( key, callback );
    }

    public void clear()
    {
        this.cache.invalidateAll();
    }

    public int getSize()
    {
        return (int) this.cache.size();
    }

    public void remove( final String key )
    {
        cache.invalidate( key );
    }

    public void removePattern( final String keyRegex )
    {
        final Pattern pattern = Pattern.compile( keyRegex );
        final Stream<String> keyStream = cache.asMap().keySet().stream().filter( ( k ) -> pattern.matcher( k ).matches() );

        final Iterable<String> keys = keyStream::iterator;
        cache.invalidateAll( keys );
    }

}
