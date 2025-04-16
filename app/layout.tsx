import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Invoice Generator by Infinity Linkage',
  description: 'Create professional invoices and quotations effortlessly.',
  generator: 'Infinity Linkage',
  keywords: ['Invoice Generator', 'Quotation Generator', 'Business Tools', 'Infinity Linkage'],
  authors: [{ name: 'Infinity Linkage' }],
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
