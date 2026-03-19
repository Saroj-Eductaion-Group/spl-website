import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { headers } from 'next/headers'
import { ClerkProvider } from '@clerk/nextjs'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  title: 'SPL — Saroj Premier League U19',
  description: 'Official website for Saroj Premier League Under-19 Cricket Tournament — Uttar Pradesh',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = headers().get('x-pathname') || ''
  const isPanel = pathname.startsWith('/admin') || pathname.startsWith('/coordinator')

  return (
    <ClerkProvider dynamic>
      <html lang="en">
        <body className={inter.className}>
          {!isPanel && <Navbar />}
          <main className={!isPanel ? 'min-h-screen pt-28' : 'min-h-screen'}>
            {children}
          </main>
          {!isPanel && <Footer />}
        </body>
      </html>
    </ClerkProvider>
  )
}
