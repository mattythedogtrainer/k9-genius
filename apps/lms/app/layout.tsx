import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'K9 Design System - Learning Platform',
  description: 'Premium certification and training platform for K9 Design System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-lms-bg text-teal-900 antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
