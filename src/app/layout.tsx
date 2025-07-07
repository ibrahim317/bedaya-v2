import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";
import "./printable.css";
import AuthProvider from "@/providers/AuthProvider";
import AntdRegistry from "@/providers/AntdRegistry";
import ThemeProvider from "@/providers/ThemeProvider";
import { App as AntApp } from 'antd';
import QueryProvider from '@/providers/QueryProvider';
import OfflineNotification from '@/components/OfflineNotification';
import OfflineProvider from '@/providers/OfflineProvider';
import SyncProgress from '@/components/SyncProgress';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Bedaya Patient Management System",
  description: "Bedaya Patient Management System",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#000000" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <AntdRegistry>
          <ThemeProvider>
            <OfflineProvider>
              <AuthProvider>
                <QueryProvider>
                  <AntApp>
                    <OfflineNotification />
                    {children}
                    <SyncProgress />
                  </AntApp>
                </QueryProvider>
              </AuthProvider>
            </OfflineProvider>
          </ThemeProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
