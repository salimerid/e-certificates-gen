import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TBC Construction | Personnel & Certificate Management',
  description: 'TBC Construction Official Training Records & Verified Certificate Management Portal',
  icons: {
    icon: '/images/tbc-logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/css/bootstrap-icons.min.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}
