'use client';

import * as React from 'react';
import { Inter } from 'next/font/google';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { Toaster } from '@/components/ui/toaster';
import { ThemeToggle } from '@/components/ThemeToggle';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });
import StoreProvider from '@/store/StoreProvider';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StoreProvider>
          <NextThemesProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
          >
            <div className="relative flex min-h-screen flex-col bg-background">
              <main className="flex-1">{children}</main>
            </div>
            <Toaster />
            <ThemeToggle className="absolute right-6 top-6" />
          </NextThemesProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
