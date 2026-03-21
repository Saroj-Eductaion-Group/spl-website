'use client'

import { useEffect, useState } from 'react'

interface Sponsor { id: string; name: string; tier: string; logoUrl?: string; website?: string; active: boolean }

export default function SponsorStrip() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([])

  useEffect(() => {
    fetch('/api/admin/sponsors')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setSponsors(data.filter((s: Sponsor) => s.active)) })
      .catch(() => {})
  }, [])

  if (sponsors.length === 0) return null

  return (
    <div className="bg-[#131318] border-y border-[#444650]/15 py-6 px-6">
      <div className="max-w-screen-xl mx-auto">
        <p className="text-center text-[0.6rem] font-headline font-bold uppercase tracking-[0.3em] text-[#c4c6d0]/40 mb-5">Official Sponsors</p>
        <div className="flex flex-wrap items-center justify-center gap-6">
          {sponsors.map(s => (
            s.website ? (
              <a key={s.id} href={s.website} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 border border-[#444650]/20 px-5 py-3 hover:border-[#ffd700]/40 transition-colors group">
                {s.logoUrl
                  ? <img src={s.logoUrl} alt={s.name} className="h-8 w-auto object-contain" />
                  : <span className="text-sm font-headline font-bold text-[#c4c6d0] group-hover:text-[#ffd700] transition-colors">{s.name}</span>}
                <span className="material-symbols-outlined text-[#444650] group-hover:text-[#ffd700] transition-colors" style={{ fontSize: '14px' }}>open_in_new</span>
              </a>
            ) : (
              <div key={s.id} className="flex items-center border border-[#444650]/20 px-5 py-3">
                {s.logoUrl
                  ? <img src={s.logoUrl} alt={s.name} className="h-8 w-auto object-contain" />
                  : <span className="text-sm font-headline font-bold text-[#c4c6d0]">{s.name}</span>}
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  )
}
