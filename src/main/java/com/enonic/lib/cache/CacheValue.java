package com.enonic.lib.cache;

import java.util.ArrayList;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import com.enonic.xp.script.ScriptValue;
import com.enonic.xp.script.serializer.MapGenerator;
import com.enonic.xp.script.serializer.MapSerializable;

final class CacheValue
    implements MapSerializable
{
    private static final int MAX_DEPTH = 100;

    private final Map<String, Object> value;

    private CacheValue( final Map<String, Object> value )
    {
        this.value = value;
    }

    static Object toHostData( final ScriptValue value )
    {
        return convert( value, 0 );
    }

    private static Object convert( final ScriptValue value, final int depth )
    {
        if ( value == null )
        {
            return null;
        }
        if ( depth > MAX_DEPTH )
        {
            throw new IllegalArgumentException(
                "Value cannot be stored in a named cache: the structure is cyclic or nested deeper than " + MAX_DEPTH + " levels" );
        }
        if ( value.isFunction() )
        {
            throw new IllegalArgumentException(
                "Value cannot be stored in a named cache: functions are not data and cannot be shared between contexts" );
        }
        if ( value.isArray() )
        {
            final List<Object> list = new ArrayList<>();
            for ( final ScriptValue element : value.getArray() )
            {
                list.add( convert( element, depth + 1 ) );
            }
            return list;
        }
        if ( value.isObject() )
        {
            final Map<String, Object> map = new LinkedHashMap<>();
            for ( final String key : value.getKeys() )
            {
                map.put( key, convert( value.getMember( key ), depth + 1 ) );
            }
            return new CacheValue( map );
        }
        if ( value.isValue() )
        {
            return scalar( value.getValue() );
        }
        return null;
    }

    private static Object scalar( final Object raw )
    {
        if ( raw == null || raw instanceof String || raw instanceof Number || raw instanceof Boolean || raw instanceof Date )
        {
            return raw;
        }
        throw new IllegalArgumentException(
            "Value cannot be stored in a named cache: values of type " + raw.getClass().getName() +
                " are not data and cannot be shared between contexts" );
    }

    @Override
    public void serialize( final MapGenerator gen )
    {
        for ( final Map.Entry<String, Object> entry : this.value.entrySet() )
        {
            gen.value( entry.getKey(), entry.getValue() );
        }
    }
}
