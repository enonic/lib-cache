package com.enonic.lib.cache;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.concurrent.TimeUnit;

import org.osgi.framework.BundleContext;
import org.osgi.framework.ServiceReference;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Deactivate;
import org.osgi.util.tracker.ServiceTracker;
import org.osgi.util.tracker.ServiceTrackerCustomizer;

import com.google.common.cache.Cache;
import com.google.common.cache.CacheBuilder;

import com.enonic.xp.app.Application;
import com.enonic.xp.app.ApplicationKey;

@Component(immediate = true, service = CacheRegistry.class)
public class CacheRegistry
    implements ServiceTrackerCustomizer<Application, Application>
{
    private final ConcurrentMap<ApplicationKey, ConcurrentMap<String, Cache<String, Object>>> caches = new ConcurrentHashMap<>();

    private final BundleContext context;

    private final ServiceTracker<Application, Application> tracker;

    @Activate
    public CacheRegistry( final BundleContext context )
    {
        this.context = context;
        this.tracker = new ServiceTracker<>( context, Application.class, this );
        this.tracker.open();
    }

    @Deactivate
    public void deactivate()
    {
        this.tracker.close();
        this.caches.clear();
    }

    public Cache<String, Object> getOrCreate( final ApplicationKey app, final String name, final Integer size, final Integer expire )
    {
        return this.caches.computeIfAbsent( app, k -> new ConcurrentHashMap<>() ).computeIfAbsent( name, n -> build( size, expire ) );
    }

    private static Cache<String, Object> build( final Integer size, final Integer expire )
    {
        final CacheBuilder<Object, Object> builder = CacheBuilder.newBuilder();
        if ( size != null )
        {
            builder.maximumSize( size );
        }
        if ( expire != null )
        {
            builder.expireAfterWrite( expire, TimeUnit.SECONDS );
        }
        return builder.build();
    }

    @Override
    public Application addingService( final ServiceReference<Application> reference )
    {
        return this.context.getService( reference );
    }

    @Override
    public void modifiedService( final ServiceReference<Application> reference, final Application application )
    {
    }

    @Override
    public void removedService( final ServiceReference<Application> reference, final Application application )
    {
        this.caches.remove( application.getKey() );
        this.context.ungetService( reference );
    }
}
