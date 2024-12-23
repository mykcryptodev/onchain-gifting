export const metadata = {
  title: 'Gift Pack',
  description: 'Create and share digital gift packs',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
} 