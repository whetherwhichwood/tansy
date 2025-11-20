import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/layout/Header'
import { FeatureFlagsProvider } from '@/lib/featureFlags'
import BeforeAfterToggle from '@/components/ui/BeforeAfterToggle'

export const metadata: Metadata = {
  title: 'Tansy - Healthcare Navigation',
  description: 'Healthcare appointment scheduling and navigation',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <FeatureFlagsProvider>
          <Header />
          <BeforeAfterToggle />
          {children}
        </FeatureFlagsProvider>
      </body>
    </html>
  )
}

