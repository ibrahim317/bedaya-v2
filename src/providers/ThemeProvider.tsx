'use client';

import { ConfigProvider } from 'antd';
import { ReactNode } from 'react';

const theme = {
  token: {
    colorPrimary: '#4CAF50',
    borderRadius: 6,
    colorBgContainer: '#ffffff',
    colorBorder: '#e5e7eb',
    colorText: '#374151',
    colorTextSecondary: '#6b7280',
  },
  components: {
    Menu: {
      itemSelectedBg: '#e6f4ff',
      itemSelectedColor: '#4CAF50',
    },
  },
};

export default function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <ConfigProvider theme={theme}>
      {children}
    </ConfigProvider>
  );
} 