import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { AppProviders } from '@/providers';
import Navbar from '@/components/navbar';
import { AppContextProvider } from '@/context';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Swap Token',
  description: '',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          'min-h-dvh bg-background text-foreground antialiased',
          inter.className
        )}
      >
        <AppContextProvider>
          <AppProviders>
            <main className="flex min-h-dvh flex-col">
              <header className="h-16 w-screen shadow-md">
                <Navbar />
              </header>
              <div className="flex-1 flex px-4 md:container">{children}</div>
            </main>
            <Toaster position="top-right" />
          </AppProviders>
        </AppContextProvider>
      </body>
    </html>
  );
}
