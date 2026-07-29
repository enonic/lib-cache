package com.enonic.lib.cache;

import java.util.function.Supplier;
import java.util.regex.Pattern;
import java.util.stream.Stream;

import com.google.common.cache.Cache;

import com.enonic.xp.app.ApplicationKey;
import com.enonic.xp.script.ScriptValue;
import com.enonic.xp.script.bean.BeanContext;
import com.enonic.xp.script.bean.ScriptBean;

import static java.util.Objects.requireNonNull;

public final class SharedCacheBean
    implements ScriptBean
{
    private ApplicationKey applicationKey;

    private Supplier<CacheRegistry> registry;

    private String name;

    private Integer size;

    private Integer expire;

    private Cache<String, Object> cache;

    @Override
    public void initialize( final BeanContext context )
    {
        this.applicationKey = context.getApplicationKey();
        this.registry = context.getService( CacheRegistry.class );
    }

    public void setName( final String name )
    {
        this.name = name;
    }

    public void setSize( final int size )
    {
        this.size = size;
    }

    public void setExpire( final int expire )
    {
        this.expire = expire;
    }

    public void build()
    {
        this.cache = requireNonNull( this.registry.get() ).getOrCreate( this.applicationKey, this.name, this.size, this.expire );
    }

    public Object get( final String key, final ScriptValue callback )
        throws Exception
    {
        return this.cache.get( key, () -> CacheValue.toHostData( callback.call() ) );
    }

    public Object getIfPresent( final String key )
    {
        return this.cache.getIfPresent( key );
    }

    public void put( final String key, final ScriptValue value )
    {
        this.cache.put( key, CacheValue.toHostData( value ) );
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
        this.cache.invalidate( key );
    }

    public void removePattern( final String keyRegex )
    {
        final Pattern pattern = Pattern.compile( keyRegex );
        final Stream<String> keyStream = this.cache.asMap().keySet().stream().filter( k -> pattern.matcher( k ).matches() );

        final Iterable<String> keys = keyStream::iterator;
        this.cache.invalidateAll( keys );
    }
}
