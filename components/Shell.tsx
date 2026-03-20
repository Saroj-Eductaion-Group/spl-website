'use client'

import { usePathname } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isPanel = pathname.startsWith('/admin') || pathname.startsWith('/coordinator')

  return (
    <div className={isPanel ? '' : 'bg-[#0b0b0f] text-[#e4e1e9] font-body'}>
      {!isPanel && <Navbar />}
      <main className="min-h-screen">
        {children}
      </main>
      {!isPanel && <Footer />}
    </div>
  )
}
