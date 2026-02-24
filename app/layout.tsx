import './globals.css';
import { Inter, Playfair_Display } from 'next/font/google';
import { Providers } from '@/components/providers/Providers';
import type { Metadata } from 'next';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  style: ['normal', 'italic'],
});

export const metadata: Metadata = {
  title: "QanoonAI - Pakistan's AI-Powered Legal Intelligence Platform",
  description:
    "QanoonAI combines 300,000+ Pakistani court judgments with AI to give judges neutral case briefs, lawyers instant drafting, and citizens free legal guidance.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
