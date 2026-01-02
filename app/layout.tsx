import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Delta TMS - Wheelchair Transportation Platform',
  description: 'Professional wheelchair transportation management system for dispatchers, drivers, facilities, and patients.',
  keywords: ['wheelchair transport', 'medical transportation', 'NEMT', 'patient transport', 'dispatch management'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-gray-50 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
