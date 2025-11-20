import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Body Double Virtual Space',
  description: 'A virtual body-doubling platform for neurodivergent individuals who need external presence to maintain focus and motivation.',
  keywords: ['body doubling', 'ADHD', 'autism', 'focus', 'productivity', 'neurodivergent'],
  authors: [{ name: 'Griffin Baker' }],
  creator: 'Griffin Baker',
  publisher: 'Griffin Baker Inc.',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://bodydouble.space',
    title: 'Body Double Virtual Space',
    description: 'A virtual body-doubling platform for neurodivergent individuals who need external presence to maintain focus and motivation.',
    siteName: 'Body Double Virtual Space',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Body Double Virtual Space',
    description: 'A virtual body-doubling platform for neurodivergent individuals who need external presence to maintain focus and motivation.',
  },
  manifest: '/manifest.json',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#6366f1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full bg-gray-50 antialiased`}>
        <div id="root" className="h-full">
          {children}
        </div>
      </body>
    </html>
  )
}