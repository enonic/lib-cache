package com.enonic.lib.cache;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.osgi.framework.BundleContext;
import org.osgi.framework.FrameworkUtil;

import com.enonic.xp.security.SecurityService;
import com.enonic.xp.testing.ScriptTestSupport;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.nullable;

public class CacheScriptTest
    extends ScriptTestSupport
{
    private SecurityService securityService;

    @BeforeEach
    public void initialize()
        throws Exception
    {
        super.initialize();
        this.securityService = Mockito.mock( SecurityService.class );
        addService( SecurityService.class, this.securityService );
        addService( CacheRegistry.class, new CacheRegistry( mockBundleContext() ) );
    }

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
    public void testCache()
    {
        runFunction( "/test/cache-test.js", "testCache" );
    }

    @Test
    public void testGetIfPresent()
    {
        runFunction( "/test/cache-test.js", "testGetIfPresent" );
    }

    @Test
    public void testPut()
    {
        runFunction( "/test/cache-test.js", "testPut");
    }

    @Test
    public void testRemove()
    {
        runFunction( "/test/cache-test.js", "testRemove" );
    }

    @Test
    public void testRemovePattern()
    {
        runFunction( "/test/cache-test.js", "testRemovePattern" );
    }

    @Test
    public void testNamedShareSameName()
    {
        runFunction( "/test/cache-test.js", "testNamedShareSameName" );
    }

    @Test
    public void testNamedDifferentNamesIsolated()
    {
        runFunction( "/test/cache-test.js", "testNamedDifferentNamesIsolated" );
    }

    @Test
    public void testUnnamedNotShared()
    {
        runFunction( "/test/cache-test.js", "testUnnamedNotShared" );
    }

    @Test
    public void testNamedGetWithCallback()
    {
        runFunction( "/test/cache-test.js", "testNamedGetWithCallback" );
    }

    @Test
    public void testNamedCopySemantics()
    {
        runFunction( "/test/cache-test.js", "testNamedCopySemantics" );
    }

    @Test
    public void testUnnamedAcceptsAnyValue()
    {
        runFunction( "/test/cache-test.js", "testUnnamedAcceptsAnyValue" );
    }

    @Test
    public void testNamedPutFunctionThrows()
    {
        runFunction( "/test/cache-test.js", "testNamedPutFunctionThrows" );
    }

    @Test
    public void testNamedPutNestedFunctionThrows()
    {
        runFunction( "/test/cache-test.js", "testNamedPutNestedFunctionThrows" );
    }
}
