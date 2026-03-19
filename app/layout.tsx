import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { headers } from 'next/headers'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SPL — Saroj Premier League U19',
  description: 'Official website for Saroj Premier League Under-19 Cricket Tournament — Uttar Pradesh',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = headers().get('x-pathname') || ''
  const isPanel = pathname.startsWith('/admin') || pathname.startsWith('/coordinator')

  return (
    <html lang="en">
      <body className={inter.className}>
        {!isPanel && <Navbar />}
        <main className={!isPanel ? 'min-h-screen pt-24' : 'min-h-screen'}>
          {children}
        </main>
        {!isPanel && <Footer />}
      </body>
    </html>
  )
}
