// app/layout.tsx
import './globals.css';
import { Inter } from 'next/font/google';
import { AuthProvider } from './components/AuthContext';
import ClientLayout from './components/ClientLayout';
import { MantineProvider } from '@mantine/core';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Your App',
  description: 'Your App Description',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <MantineProvider
            withGlobalStyles
            withNormalizeCSS
            theme={{
              /** Put your Mantine theme override here */
            }}
          >
            <ClientLayout>{children}</ClientLayout>
          </MantineProvider>
        </AuthProvider>
      </body>
    </html>
  );
}