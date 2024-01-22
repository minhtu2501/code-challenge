'use client';
import { PropsWithChildren } from 'react';
import { ThemeProvider } from './theme-provider';

export const AppProviders = ({ children }: PropsWithChildren) => {
  return (
    <ThemeProvider attribute="class" enableSystem defaultTheme="system">
      {children}
    </ThemeProvider>
  );
};
