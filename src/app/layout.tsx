import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: '3D Earth Coordinate Explorer — Latitude & Longitude Lab',
  description: 'Interactive 3D Earth WebGL simulation for discovering and exploring latitude, longitude, equator, prime meridian, and geographic coordinate systems.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} dark`}>
      <body className="font-sans antialiased bg-space-950 text-slate-100 min-h-screen select-none overflow-hidden">
        {children}
      </body>
    </html>
  );
}
