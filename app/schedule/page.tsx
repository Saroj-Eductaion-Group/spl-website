'use client'

import { useEffect, useState } from 'react'
import SponsorStrip from '@/components/SponsorStrip'

interface Match {
  id: string; phase: string; venue: string; date: string
  result?: string; winner?: string; score1?: string; score2?: string
  team1: { name: string; district: string }
  team2?: { name: string; district: string }
}

const phaseColors: Record<string, string> = {
  DISTRICT: 'text-[#ffd700] border-[#ffd700]/30',
  ZONAL: 'text-[#c4c6d0] border-[#444650]/40',
  SEMI_FINAL: 'text-orange-400 border-orange-400/30',
  FINAL: 'text-[#ffd700] border-[#ffd700]/50',
}

const timeline = [
  { week: 'Week 1–2', label: 'District Level', icon: '🏏' },
  { week: 'Week 3', label: 'Zonal Championships', icon: '⚡' },
  { week: 'Week 4', label: 'State Semi-Finals', icon: '🔥' },
  { week: 'Final', label: 'Ekana Stadium', icon: '🏆' },
]

export default function Schedule() {
  const [matches, setMatches] = useState<Match[]>([])
  const [activePhase, setActivePhase] = useState('ALL')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/schedule').then(r => r.json())
      .then(data => { if (Array.isArray(data)) setMatches(data) })
      .catch(() => {}).finally(() => setLoading(false))
  }, [])

  const phases = ['ALL', 'DISTRICT', 'ZONAL', 'SEMI_FINAL', 'FINAL']
  const [activeDistrict, setActiveDistrict] = useState('ALL')

  const districts = ['ALL', ...Array.from(new Set(matches.flatMap(m => [m.team1.district, m.team2?.district].filter(Boolean) as string[]))).sort()]

  const filtered = matches.filter(m => {
    const phaseOk = activePhase === 'ALL' || m.phase === activePhase
    const districtOk = activeDistrict === 'ALL' || m.team1.district === activeDistrict || m.team2?.district === activeDistrict
    return phaseOk && districtOk
  })

  return (
    <div className="min-h-screen bg-[#0b0b0f] text-[#e4e1e9] pt-20">

      {/* Hero */}
      <section className="spl-hero border-b border-[#ffd700]/15">
        <div className="max-w-screen-xl mx-auto relative z-10">
          <p className="text-[#ffd700] font-headline font-bold text-xs tracking-[0.3em] uppercase mb-4">Fixtures</p>
          <h1 className="font-headline font-black text-5xl md:text-7xl italic uppercase tracking-tighter leading-[0.9] mb-6 text-white">
            MATCH <br /><span className="text-[#ffd700]">SCHEDULE</span>
          </h1>
          <p className="text-white/70 text-lg max-w-2xl">SPL Tournament Match Schedule Across Uttar Pradesh</p>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-12 px-6 bg-[#131318] border-b border-[#444650]/15">
        <div className="max-w-screen-xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-0">
          {timeline.map((t, i) => (
            <div key={t.week} className={`p-6 text-center ${i < timeline.length - 1 ? 'border-r border-[#444650]/15' : ''}`}>
              <div className="text-3xl mb-3">{t.icon}</div>
              <div className="text-xs font-headline font-bold uppercase tracking-widest text-[#ffd700] mb-1">{t.week}</div>
              <div className="text-sm font-headline font-bold uppercase text-[#c4c6d0]">{t.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Fixtures */}
      <section className="py-16 px-6">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
            <div>
              <div className="w-24 h-1 bg-[#ffd700] mb-4" />
              <h2 className="font-headline font-black text-3xl uppercase tracking-tighter italic">Match Fixtures</h2>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap gap-2">
                {phases.map(p => (
                  <button key={p} onClick={() => setActivePhase(p)}
                    className={`px-4 py-2 text-xs font-headline font-black uppercase tracking-widest transition-all ${activePhase === p ? 'bg-[#ffd700] text-[#002366]' : 'border border-[#444650]/40 text-[#c4c6d0] hover:border-[#ffd700] hover:text-[#ffd700]'}`}>
                    {p.replace('_', ' ')}
                  </button>
                ))}
              </div>
              {districts.length > 1 && (
                <div className="flex flex-wrap gap-2">
                  {districts.map(d => (
                    <button key={d} onClick={() => setActiveDistrict(d)}
                      className={`px-3 py-1.5 text-[0.6rem] font-headline font-black uppercase tracking-widest transition-all ${activeDistrict === d ? 'bg-[#002366] text-[#ffd700] border border-[#ffd700]/40' : 'border border-[#444650]/30 text-[#c4c6d0]/60 hover:border-[#ffd700]/40 hover:text-[#ffd700]'}`}>
                      {d === 'ALL' ? 'All Districts' : d}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-2 border-[#ffd700] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length > 0 ? (
            <div className="space-y-4">
              {filtered.map(match => (
                <div key={match.id} className="bg-[#131318] border border-[#444650]/20 p-6 hover:border-[#ffd700]/30 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className={`text-[0.6rem] font-headline font-bold uppercase tracking-widest border px-2 py-0.5 ${phaseColors[match.phase] || 'text-[#c4c6d0] border-[#444650]/30'}`}>
                          {match.phase.replace('_', ' ')}
                        </span>
                        <span className="text-xs text-[#c4c6d0]">
                          {new Date(match.date).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-headline font-black text-xl uppercase">{match.team1.name}</span>
                        <span className="text-[#444650] font-headline font-light text-lg">VS</span>
                        <span className="font-headline font-black text-xl uppercase text-[#ffd700]">{match.team2?.name || 'TBD'}</span>
                      </div>
                      <p className="text-xs text-[#c4c6d0] mt-2">📍 {match.venue}</p>
                    </div>
                    {match.result ? (
                      <div className="bg-[#0b0b0f] border border-[#ffd700]/20 px-6 py-4 text-center min-w-[160px]">
                        {match.score1 && <p className="text-xs text-[#c4c6d0]">{match.team1.name}: <span className="text-[#e4e1e9] font-bold">{match.score1}</span></p>}
                        {match.score2 && <p className="text-xs text-[#c4c6d0]">{match.team2?.name}: <span className="text-[#e4e1e9] font-bold">{match.score2}</span></p>}
                        {match.winner && <p className="text-xs text-[#ffd700] font-headline font-bold uppercase mt-2">🏆 {match.winner}</p>}
                      </div>
                    ) : (
                      <div className="border border-[#444650]/30 px-6 py-4 text-center min-w-[120px]">
                        <p className="text-xs font-headline font-bold uppercase tracking-widest text-[#c4c6d0]">Upcoming</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border border-[#444650]/20">
              <div className="text-5xl mb-4">📅</div>
              <p className="font-headline font-bold uppercase tracking-widest text-[#c4c6d0]">No fixtures scheduled yet</p>
              <p className="text-[#c4c6d0]/50 text-sm mt-2">Check back soon for match schedule</p>
            </div>
          )}
        </div>
      </section>

      {/* Grand Final */}
      <SponsorStrip />
      <section className="py-20 px-6 bg-[#002366] border-t border-[#ffd700]/20 text-center">
        <div className="text-6xl mb-6">🏟️</div>
        <h2 className="font-headline font-black text-4xl italic uppercase tracking-tighter mb-3 text-white">
          Grand Final — <span className="text-[#ffd700]">Ekana Stadium</span>
        </h2>
        <p className="text-white/70">Lucknow, Uttar Pradesh • Prize: ₹11,00,000 • Scholarship: 50%</p>
      </section>
    </div>
  )
}
