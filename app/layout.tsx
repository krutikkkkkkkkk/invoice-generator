import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Invoice Generator',
  description: 'Create professional invoices and quotations effortlessly.',
  generator: 'Infinity Linkage',
  keywords: ['Invoice Generator', 'Quotation Generator', 'Business Tools', 'Infinity Linkage'],
  authors: [{ name: 'Infinity Linkage' }],
  viewport: 'width=device-width, initial-scale=1.0',
  themeColor: '#4CAF50',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
