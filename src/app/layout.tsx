import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";
import AuthProvider from "@/providers/AuthProvider";
import AntdRegistry from "@/providers/AntdRegistry";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Bedaya Authentication App",
  description: "Authentication app with NextAuth and Mongoose",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          <AntdRegistry>
            {children}
          </AntdRegistry>
        </AuthProvider>
      </body>
    </html>
  );
}
