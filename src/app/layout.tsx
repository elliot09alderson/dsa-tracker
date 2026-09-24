import type { Metadata } from 'next';
import { ProgressProvider } from '@/lib/useProgress';
import './globals.css';

export const metadata: Metadata = {
  title: 'DSA Tracker',
  description:
    '261 interview problems with brute-force, better and optimal solutions, company tags and a built-in practice editor.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* One provider at the root so every page shares the same progress. */}
        <ProgressProvider>{children}</ProgressProvider>
      </body>
    </html>
  );
}
