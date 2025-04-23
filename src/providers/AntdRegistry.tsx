'use client';

import React from 'react';
import { createCache, extractStyle, StyleProvider } from '@ant-design/cssinjs';
import { ConfigProvider, theme } from 'antd';

// This component is used for Server Components setup
const StyledComponentsRegistry = ({ children }: React.PropsWithChildren) => {
  const cache = React.useMemo(() => createCache(), []);
  const [mounted, setMounted] = React.useState(false);

  // Prevent hydration issues
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // No need to reset cache on client side as it causes issues

  return (
    <StyleProvider cache={cache}>
      <ConfigProvider
        theme={{
          algorithm: theme.defaultAlgorithm,
          token: {
            colorPrimary: '#1890ff',
            borderRadius: 6,
          },
        }}
      >
        {mounted ? children : null}
        {/* Extract style on server side */}
        {typeof window === 'undefined' && (
          <script
            dangerouslySetInnerHTML={{
              __html: `</script>${extractStyle(cache)}<script>`,
            }}
          />
        )}
      </ConfigProvider>
    </StyleProvider>
  );
};

export default StyledComponentsRegistry; 