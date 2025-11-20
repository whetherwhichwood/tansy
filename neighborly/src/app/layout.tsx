import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import { PWAInstaller } from '@/components/pwa/PWAInstaller'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Neighborly — Neighbors helping neighbors',
    template: '%s • Neighborly'
  },
  description: 'A private micro-errand and favor-exchange network for HOAs and residential communities. Skip the Facebook chaos, connect with verified neighbors.',
  keywords: ['neighborhood', 'HOA', 'community', 'errands', 'favor exchange', 'neighbors', 'local help'],
  authors: [{ name: 'Neighborly' }],
  creator: 'Neighborly',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://neighborly.griffinbaker.com',
    siteName: 'Neighborly',
    title: 'Neighborly — Neighbors helping neighbors',
    description: 'A private micro-errand and favor-exchange network for HOAs and residential communities.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Neighborly — Neighbors helping neighbors',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Neighborly — Neighbors helping neighbors',
    description: 'A private micro-errand and favor-exchange network for HOAs and residential communities.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.ico',
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased bg-gray-50 text-gray-900">
        <div className="min-h-screen">
          {children}
        </div>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10B981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
            },
          }}
        />
        <PWAInstaller />
      </body>
    </html>
  )
}