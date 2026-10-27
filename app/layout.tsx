import type { Metadata, Viewport } from 'next';
import { cormorant, pretendard, gowunBatang, blackHanSans } from '@/lib/fonts';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { SkipLink } from '@/components/SkipLink';
import { ToastProvider } from '@/components/Toast';
import { getCurrentUser } from '@/lib/auth';

export const metadata: Metadata = {
  title: {
    template: '%s | KDramaWorld',
    default: 'KDramaWorld · Korean Drama Archive & Discovery',
  },
  description:
    'A cinematic archive where people discover Korean dramas, track what they watch, keep private journal notes, rank, publish lists, and get transparent recommendations.',
  keywords: ['K-drama', 'Korean drama', '한국 드라마', 'KDramaWorld', 'drama tracker', 'watchlist', 'reviews'],
  authors: [{ name: 'KDramaWorld' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'KDramaWorld · Korean Drama Archive',
    description: 'Some stories never leave you. 어떤 이야기는 영원히 마음에 남는다.',
    siteName: 'KDramaWorld',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0a0c14' },
    { media: '(prefers-color-scheme: light)', color: '#f9f6ee' },
  ],
  width: 'device-width',
  initialScale: 1,
};

// Inline script to prevent theme flash
const themeScript = `
(function() {
  try {
    var stored = localStorage.getItem('kdrama-theme');
    var isDark = stored ? stored === 'dark' : true;
    if (!stored && window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      isDark = false;
    }
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  } catch (e) {}
})();
`;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${cormorant.variable} ${pretendard.variable} ${gowunBatang.variable} ${blackHanSans.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex flex-col min-h-screen">
        <ToastProvider>
          <SkipLink />
          <Navbar user={user} />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
