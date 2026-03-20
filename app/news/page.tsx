'use client'

import { useEffect, useState } from 'react'

interface Announcement { id: string; title: string; content: string; type: string; active: boolean; createdAt: string }

const typeBadge: Record<string, string> = {
  INFO: 'text-[#ffd700] border-[#ffd700]/30',
  IMPORTANT: 'text-red-400 border-red-400/30',
  UPDATE: 'text-green-400 border-green-400/30',
}

const staticNews = [
  { id: 1, title: 'SPL Registration Opens', excerpt: 'Team and individual registrations are now open for Saroj Premier League Under-19 tournament.', date: '2025-02-15', category: 'Registration' },
  { id: 2, title: 'Ekana Stadium Confirmed as Final Venue', excerpt: 'The grand finale of SPL will be held at the prestigious Ekana Cricket Stadium in Lucknow.', date: '2025-02-10', category: 'Venue' },
  { id: 3, title: 'Prize Money ₹11 Lakhs Announced', excerpt: 'Winner prize money is ₹11,00,000 making it the biggest U19 tournament in UP.', date: '2025-02-08', category: 'Prize' },
  { id: 4, title: '50% Scholarship for All Participants', excerpt: 'Every player participating in SPL will be eligible for 50% scholarship at Saroj International University.', date: '2025-02-05', category: 'Scholarship' },
]

export default function News() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/announcements').then(r => r.json())
      .then(data => { if (Array.isArray(data)) setAnnouncements(data.filter((a: Announcement) => a.active)) })
      .catch(() => {}).finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-[#0b0b0f] text-[#e4e1e9] pt-20">

      {/* Hero */}
      <section className="spl-hero border-b border-[#ffd700]/15">
        <div className="max-w-screen-xl mx-auto relative z-10">
          <p className="text-[#ffd700] font-headline font-bold text-xs tracking-[0.3em] uppercase mb-4">The Feed</p>
          <h1 className="font-headline font-black text-5xl md:text-7xl italic uppercase tracking-tighter leading-[0.9] mb-6 text-white">
            NEWS & <br /><span className="text-[#ffd700]">ANNOUNCEMENTS</span>
          </h1>
          <p className="text-white/70 text-lg max-w-2xl">Latest updates from SPL Tournament</p>
        </div>
      </section>

      {/* Official Announcements */}
      <section className="py-16 px-6 bg-[#131318] border-b border-[#444650]/15">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex items-center gap-3 mb-10">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <div className="w-24 h-1 bg-red-500" />
            <h2 className="font-headline font-black text-3xl uppercase tracking-tighter italic">Official Announcements</h2>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-2 border-[#ffd700] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : announcements.length > 0 ? (
            <div className="space-y-4">
              {announcements.map(ann => (
                <div key={ann.id} className="bg-[#0b0b0f] border border-[#444650]/20 p-6 hover:border-[#ffd700]/30 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`text-[0.6rem] font-headline font-bold uppercase tracking-widest border px-2 py-0.5 ${typeBadge[ann.type] || 'text-[#c4c6d0] border-[#444650]/30'}`}>
                          {ann.type}
                        </span>
                      </div>
                      <h3 className="font-headline font-bold uppercase tracking-tight mb-2">{ann.title}</h3>
                      <p className="text-[#c4c6d0] text-sm">{ann.content}</p>
                    </div>
                    <span className="text-xs text-[#c4c6d0] whitespace-nowrap font-headline">
                      {new Date(ann.createdAt).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border border-[#444650]/20">
              <p className="font-headline font-bold uppercase tracking-widest text-[#c4c6d0]">No announcements at this time</p>
              <p className="text-[#c4c6d0]/50 text-sm mt-2">Check back soon</p>
            </div>
          )}
        </div>
      </section>

      {/* Featured News */}
      <section className="py-16 px-6">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex items-center gap-6 mb-12 relative">
            <h2 className="font-headline font-black text-6xl md:text-8xl uppercase tracking-tighter opacity-[0.03] leading-none select-none">THE FEED</h2>
            <h2 className="absolute font-headline font-black text-3xl uppercase tracking-tight italic">Latest News</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {staticNews.slice(0, 2).map(item => (
              <div key={item.id} className="bg-[#131318] border border-[#444650]/20 overflow-hidden hover:border-[#ffd700]/30 transition-colors group">
                <div className="h-40 bg-gradient-to-br from-[#002366] to-[#131318] flex items-center justify-center border-b border-[#444650]/20">
                  <span className="font-headline font-black text-2xl italic uppercase text-[#ffd700]/30">SPL NEWS</span>
                </div>
                <div className="p-6">
                  <span className="text-[0.6rem] font-headline font-bold uppercase tracking-widest text-[#ffd700] border border-[#ffd700]/30 px-2 py-0.5">{item.category}</span>
                  <h3 className="font-headline font-black text-xl uppercase tracking-tight mt-3 mb-2 group-hover:text-[#ffd700] transition-colors">{item.title}</h3>
                  <p className="text-[#c4c6d0] text-sm leading-relaxed">{item.excerpt}</p>
                  <p className="text-xs text-[#c4c6d0]/50 mt-3 font-headline">{new Date(item.date).toLocaleDateString('en-IN')}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-[#131318] border border-[#444650]/20">
            {staticNews.map((item, i) => (
              <div key={item.id} className={`p-6 flex flex-col md:flex-row md:items-center gap-4 hover:bg-[#1c1c21] transition-colors cursor-pointer ${i < staticNews.length - 1 ? 'border-b border-[#444650]/15' : ''}`}>
                <span className="text-[0.6rem] font-headline font-bold uppercase tracking-widest text-[#ffd700] border border-[#ffd700]/30 px-2 py-0.5 w-fit">{item.category}</span>
                <div className="flex-1">
                  <h3 className="font-headline font-bold uppercase tracking-tight">{item.title}</h3>
                  <p className="text-[#c4c6d0] text-sm mt-1">{item.excerpt}</p>
                </div>
                <span className="text-xs text-[#c4c6d0]/50 font-headline whitespace-nowrap">{new Date(item.date).toLocaleDateString('en-IN')}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
