'use client';

import React from 'react';
import { createCache, extractStyle, StyleProvider } from '@ant-design/cssinjs';

// This component is used for Server Components setup
const StyledComponentsRegistry = ({ children }: React.PropsWithChildren) => {
  const cache = React.useMemo(() => createCache(), []);
  const [mounted, setMounted] = React.useState(false);

  // Prevent hydration issues
  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <StyleProvider cache={cache}>
        {mounted ? children : null}
        {/* Extract style on server side */}
        {typeof window === 'undefined' && (
          <script
            dangerouslySetInnerHTML={{
              __html: `</script>${extractStyle(cache)}<script>`,
            }}
          />
        )}
    </StyleProvider>
  );
};

export default StyledComponentsRegistry; 