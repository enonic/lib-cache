package com.enonic.lib.cache;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import com.enonic.xp.security.SecurityService;
import com.enonic.xp.testing.ScriptTestSupport;

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
    }

    @Test
    public void testCache()
    {
        runFunction( "/test/cache-test.js", "testCache" );
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
}
