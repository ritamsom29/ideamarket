import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: {
    default: 'Idea Market — Where Ideas Meet Investment',
    template: '%s | Idea Market',
  },
  description:
    'Discover opportunities, connect with investors, and turn ambitious ideas into meaningful businesses. The premier platform for the Indian startup ecosystem.',
  keywords: ['startup', 'investment', 'entrepreneur', 'investor', 'mentor', 'India', 'funding'],
  authors: [{ name: 'Idea Market' }],
  openGraph: {
    title: 'Idea Market — Where Ideas Meet Investment',
    description:
      'The premier platform connecting entrepreneurs, investors, and mentors in the Indian startup ecosystem.',
    type: 'website',
    locale: 'en_IN',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  )
}
