import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'CrisisCommand — Emergency Response',
  description: 'Real-time crisis coordination for hospitality venues',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased font-body-md selection:bg-primary-container selection:text-on-primary-container bg-background text-on-surface">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#181818',
              color: '#F5F5F5',
              border: '1px solid #2C2C2E',
              fontFamily: 'Syne, sans-serif',
            },
          }}
        />
      </body>
    </html>
  );
}
