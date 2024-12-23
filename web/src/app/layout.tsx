import { type Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gift Pack - Create and Share Digital Gift Packs',
  description: 'Create and share personalized digital gift packs with your loved ones. Send memorable digital presents securely and beautifully wrapped.',
  keywords: ['digital gifts', 'gift packs', 'online gifting', 'digital presents', 'gift sharing'],
  authors: [{ name: 'Gift Pack Team' }],
  creator: 'Gift Pack',
  publisher: 'Gift Pack',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://giftpack.app',
    siteName: 'Gift Pack',
    title: 'Gift Pack - Create and Share Digital Gift Packs',
    description: 'Create and share personalized digital gift packs with your loved ones. Send memorable digital presents securely and beautifully wrapped.',
    images: [
      {
        url: '/images/logo.png',
        width: 1200,
        height: 630,
        alt: 'Gift Pack - Digital Gifting Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gift Pack - Create and Share Digital Gift Packs',
    description: 'Create and share personalized digital gift packs with your loved ones. Send memorable digital presents securely and beautifully wrapped.',
    images: ['/images/logo.png'],
    creator: '@giftpack',
  },
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#ffffff',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://onchaingift.com" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>{children}</body>
    </html>
  )
} 