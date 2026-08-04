package com.enonic.lib.cache;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.osgi.framework.BundleContext;
import org.osgi.framework.FrameworkUtil;
import org.osgi.framework.ServiceReference;

import com.google.common.cache.Cache;

import com.enonic.xp.app.Application;
import com.enonic.xp.app.ApplicationKey;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.nullable;

public class CacheRegistryTest
{
    private static final ApplicationKey APP = ApplicationKey.from( "myapp" );

    private static BundleContext mockBundleContext()
        throws Exception
    {
        final BundleContext context = Mockito.mock( BundleContext.class );
        Mockito.when( context.createFilter( anyString() ) )
            .thenAnswer( invocation -> FrameworkUtil.createFilter( invocation.getArgument( 0 ) ) );
        Mockito.when( context.getServiceReferences( anyString(), nullable( String.class ) ) ).thenReturn( null );
        return context;
    }

    @Test
    public void sameNameReturnsSameCache()
        throws Exception
    {
        final CacheRegistry registry = new CacheRegistry( mockBundleContext() );

        final Cache<String, Object> first = registry.getOrCreate( APP, "x", 100, null );
        final Cache<String, Object> second = registry.getOrCreate( APP, "x", 100, null );

        assertThat( first ).isSameAs( second );
    }

    @Test
    public void differentNamesReturnDifferentCaches()
        throws Exception
    {
        final CacheRegistry registry = new CacheRegistry( mockBundleContext() );

        assertThat( registry.getOrCreate( APP, "a", 100, null ) ).isNotSameAs( registry.getOrCreate( APP, "b", 100, null ) );
    }

    @Test
    public void reregisteringApplicationClearsNamedCaches()
        throws Exception
    {
        final CacheRegistry registry = new CacheRegistry( mockBundleContext() );

        final Cache<String, Object> before = registry.getOrCreate( APP, "x", 100, null );
        before.put( "k", "v" );
        assertThat( before.getIfPresent( "k" ) ).isEqualTo( "v" );

        final Application application = Mockito.mock( Application.class );
        Mockito.when( application.getKey() ).thenReturn( APP );

        @SuppressWarnings("unchecked") final ServiceReference<Application> reference = Mockito.mock( ServiceReference.class );

        registry.removedService( reference, application );

        final Cache<String, Object> after = registry.getOrCreate( APP, "x", 100, null );
        assertThat( after ).isNotSameAs( before );
        assertThat( after.getIfPresent( "k" ) ).isNull();
    }
}
