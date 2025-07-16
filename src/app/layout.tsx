import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";
import "./printable.css";
import AuthProvider from "@/providers/AuthProvider";
import AntdRegistry from "@/providers/AntdRegistry";
import ThemeProvider from "@/providers/ThemeProvider";
import { App as AntApp } from 'antd';
import QueryProvider from '@/providers/QueryProvider';
import GoogleAnalytics from "@/components/GoogleAnalytics";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Bedaya Patient Management System",
  description: "Bedaya Patient Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
      <GoogleAnalytics gaId="G-SL8K5VHVEJ" />
        <AntdRegistry>
          <ThemeProvider>
            <AuthProvider>
              <QueryProvider>
                <AntApp>{children}</AntApp>
              </QueryProvider>
            </AuthProvider>
          </ThemeProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
