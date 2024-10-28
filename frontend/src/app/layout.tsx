import './globals.css';
import { Inter } from 'next/font/google';
import { AuthProvider } from './components/AuthContext';
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
            theme={{
              /** Put your Mantine theme override here */
            }}
          >
            {children}
          </MantineProvider>
        </AuthProvider>
      </body>
    </html>
  );
}