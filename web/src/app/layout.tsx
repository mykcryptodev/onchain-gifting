import { type Metadata } from 'next'

const frame = {
  version: "next",
  imageUrl: "https://onchaingift.com/images/logo.png",
  button: {
    title: "Launch Frame",
    action: {
      type: "launch_frame",
      name: "Onchain Gift",
      url: "https://onchaingift.com",
      splashImageUrl: "https://onchaingift.com/images/logo.png",
      splashBackgroundColor: "#f7f7f7",
    },
  },
};

export const metadata: Metadata = {
  title: 'Onchain Gift',
  description: 'Give the gift of coming onchain!',
  keywords: ['digital gifts', 'gift packs', 'online gifting', 'digital presents', 'gift sharing'],
  authors: [{ name: 'Onchain Gift Team' }],
  creator: 'Onchain Gift',
  publisher: 'Onchain Gift',
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
    url: 'https://onchaingift.com',
    siteName: 'Onchain Gift',
    title: 'Onchain Gift',
    description: 'Give the gift of coming onchain!',
    images: [
      {
        url: 'https://onchaingift.com/api/og',
        width: 1200,
        height: 630,
        alt: 'Onchain Gift - Digital Gifting Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Onchain Gift',
    description: 'Give the gift of coming onchain!',
    images: ['https://onchaingift.com/api/og'],
    creator: '@onchaingift',
  },
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#ffffff',
  other: {
    'fc:frame': JSON.stringify(frame),
  },
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