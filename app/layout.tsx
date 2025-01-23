'use client';

import { cn } from '@/lib/utils/cn';
import { Inter } from 'next/font/google';

import EnvLabel from '@/components/composite/env-label';
import './globals.css';

const fontHeading = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-heading',
});

const fontBody = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
});

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body className={cn('antialiased', fontHeading.variable, fontBody.variable)}>
        <EnvLabel />
        {children}
      </body>
    </html>
  );
}
