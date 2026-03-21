'use client'

import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'

export default function Footer() {
  const { isSignedIn } = useUser()
  const [isStaff, setIsStaff] = useState(false)
  useEffect(() => {
    setIsStaff(!!localStorage.getItem('adminToken') || !!localStorage.getItem('coordinatorToken'))
  }, [])
  return (
    <footer className="bg-[#001a4d] border-t border-[#ffd700]/15 pb-20 lg:pb-0">
      {/* Gold top bar */}
      <div className="w-full h-1 bg-gradient-to-r from-[#ffd700] via-[#ffe566] to-[#ffd700]" />

      <div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 px-8 py-16">

        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="w-8 h-8 bg-[#ffd700] flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[#002366]" style={{ fontSize: '16px' }}>sports_cricket</span>
            </span>
            <span className="text-xl font-headline font-black italic uppercase">
              <span className="text-[#ffd700]">Saroj</span><span className="text-white"> Premier</span>
            </span>
          </div>
          <p className="text-white/50 text-sm font-body leading-relaxed mb-6">
            Uttar Pradesh's premier cricket tournament for Class 12 students, organized by Saroj Educational Group.
          </p>
          <div className="flex gap-3">
            {['public', 'share', 'forum'].map(icon => (
              <span key={icon} className="w-9 h-9 bg-[#002366] border border-[#ffd700]/20 flex items-center justify-center text-white/40 hover:text-[#ffd700] hover:border-[#ffd700]/60 cursor-pointer transition-colors">
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>{icon}</span>
              </span>
            ))}
          </div>
        </div>

        <nav className="flex flex-col gap-3 font-body text-sm">
          <h5 className="text-[#ffd700] font-headline font-bold uppercase tracking-widest mb-2">League</h5>
          <Link href="/about" className="text-white/50 hover:text-[#ffd700] transition-all">About SPL</Link>
          <Link href="/tournament-format" className="text-white/50 hover:text-[#ffd700] transition-all">Tournament Format</Link>
          <Link href="/eligibility" className="text-white/50 hover:text-[#ffd700] transition-all">Eligibility & Rules</Link>
          <Link href="/scholarships" className="text-white/50 hover:text-[#ffd700] transition-all">Scholarship Info</Link>
          <Link href="/sponsors" className="text-white/50 hover:text-[#ffd700] transition-all">Sponsors</Link>
        </nav>

        <nav className="flex flex-col gap-3 font-body text-sm">
          <h5 className="text-[#ffd700] font-headline font-bold uppercase tracking-widest mb-2">Support</h5>
          <Link href="/schedule" className="text-white/50 hover:text-[#ffd700] transition-all">Match Schedule</Link>
          <Link href="/prizes" className="text-white/50 hover:text-[#ffd700] transition-all">Prize Money</Link>
          <Link href="/contact" className="text-white/50 hover:text-[#ffd700] transition-all">Contact Us</Link>
          {!isSignedIn && !isStaff && (
            <>
              <Link href="/admin/login" className="text-white/50 hover:text-[#ffd700] transition-all">Admin Login</Link>
              <Link href="/coordinator/login" className="text-white/50 hover:text-[#ffd700] transition-all">Coordinator Login</Link>
            </>
          )}
        </nav>
      </div>

      <div className="w-full h-px bg-[#ffd700]/20" />
      <p className="font-body text-sm uppercase tracking-widest text-white text-center py-6">
        © 2026 Saroj Premier League. All Rights Reserved. | Organized by Saroj Educational Group
      </p>
    </footer>
  )
}
