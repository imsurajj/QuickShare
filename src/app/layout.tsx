import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'QuickShare - Instant File Sharingh',
  description: 'Instant FIle Sharing without login',
  icons: {
    icon: [
      {
        url: '/icon',
        type: 'image/png',
      },
    ],
    apple: [
      {
        url: '/icon',
        type: 'image/png',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-white text-gray-900 antialiased`}>
        <div className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  )
}
