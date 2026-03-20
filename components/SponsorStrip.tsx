'use client'

import { useEffect, useState } from 'react'
import { ExternalLink } from 'lucide-react'

interface Sponsor { id: string; name: string; tier: string; logoUrl?: string; website?: string }

export default function SponsorStrip() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([])

  useEffect(() => {
    fetch('/api/admin/sponsors')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setSponsors(data.filter((s: Sponsor & { active: boolean }) => s.active)) })
      .catch(() => {})
  }, [])

  if (sponsors.length === 0) return null

  return (
    <div className="bg-white border-t border-b border-gray-100 py-6">
      <div className="container mx-auto px-4">
        <p className="text-center text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Our Sponsors</p>
        <div className="flex flex-wrap items-center justify-center gap-6">
          {sponsors.map(s => (
            s.website ? (
              <a key={s.id} href={s.website} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-100 hover:border-primary-200 hover:shadow-sm transition-all group">
                {s.logoUrl
                  ? <img src={s.logoUrl} alt={s.name} className="h-8 w-auto object-contain" />
                  : <span className="text-sm font-semibold text-gray-700 group-hover:text-primary-600">{s.name}</span>}
                <ExternalLink className="w-3 h-3 text-gray-300 group-hover:text-primary-400" />
              </a>
            ) : (
              <div key={s.id} className="flex items-center px-4 py-2 rounded-lg border border-gray-100">
                {s.logoUrl
                  ? <img src={s.logoUrl} alt={s.name} className="h-8 w-auto object-contain" />
                  : <span className="text-sm font-semibold text-gray-700">{s.name}</span>}
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  )
}
