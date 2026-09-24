import type { Metadata } from 'next';
import { AuthProvider } from '@/lib/useAuth';
import { ProgressProvider } from '@/lib/useProgress';
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from '@/lib/site';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    // Every page sets its own title via this template, so a problem page
    // reads "Majority Element | DSA Tracker" in a search result rather than
    // the generic site title repeated 313 times across the catalogue.
    template: `%s | ${SITE_NAME}`,
    default: `${SITE_NAME} — 261 DSA Interview Problems with Solutions`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    'dsa interview questions',
    'data structures and algorithms practice',
    'leetcode solutions',
    'coding interview prep',
    'faang interview questions',
  ],
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: `${SITE_NAME} — 261 DSA Interview Problems with Solutions`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
  },
  twitter: {
    card: 'summary',
    title: `${SITE_NAME} — 261 DSA Interview Problems with Solutions`,
    description: SITE_DESCRIPTION,
  },
};

// WebSite structured data, present on every page -- the one piece of
// schema.org markup that describes the site as a whole rather than any one
// page's content.
const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  description: SITE_DESCRIPTION,
  url: SITE_URL,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body>
        {/* AuthProvider outside ProgressProvider: progress needs to know who
            (if anyone) is signed in, to load and save the right document. */}
        <AuthProvider>
          <ProgressProvider>{children}</ProgressProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
