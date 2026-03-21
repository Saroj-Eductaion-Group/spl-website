'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import SponsorStrip from '@/components/SponsorStrip'

interface Match {
  id: string; phase: string; venue: string; date: string
  result?: string; winner?: string; score1?: string; score2?: string
  team1: { id: string; name: string; district: string }
  team2?: { id: string; name: string; district: string }
}

const inputCls = "w-full bg-[#0b0b0f] border border-[#444650]/40 text-[#e4e1e9] px-3 py-2 text-sm font-body placeholder:text-[#444650] focus:outline-none focus:border-[#ffd700]/60 transition-colors"

export default function CoordinatorResults() {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [district, setDistrict] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [resultForm, setResultForm] = useState({ score1: '', score2: '', winner: '', result: '' })
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('coordinatorToken')
    const dist = localStorage.getItem('coordinatorDistrict') || ''
    if (!token) { router.push('/coordinator/login'); return }
    setDistrict(dist)
    loadMatches(dist)
  }, [])

  const loadMatches = async (dist: string) => {
    const token = localStorage.getItem('coordinatorToken') || ''
    const res = await fetch(`/api/coordinator/results?district=${encodeURIComponent(dist)}`, { headers: { Authorization: `Bearer ${token}` } })
    setMatches(await res.json())
    setLoading(false)
  }

  const saveResult = async (matchId: string) => {
    const token = localStorage.getItem('coordinatorToken') || ''
    await fetch('/api/coordinator/results', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ matchId, ...resultForm })
    })
    setEditingId(null)
    loadMatches(district)
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <span className="w-8 h-8 border-2 border-[#444650] border-t-[#ffd700] rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="font-headline font-black text-3xl italic uppercase tracking-tighter text-[#e4e1e9]">Match <span className="text-[#ffd700]">Results</span></h1>
        <p className="text-[#c4c6d0]/60 text-sm mt-1">{district} District</p>
      </div>

      <div className="space-y-4">
        {matches.map(match => (
          <div key={match.id} className="bg-[#131318] border border-[#444650]/20 p-6 hover:border-[#ffd700]/20 transition-colors">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[0.6rem] font-headline font-bold uppercase tracking-widest text-[#ffd700] border border-[#ffd700]/30 px-2 py-0.5">
                    {match.phase.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-[#c4c6d0]/50">{new Date(match.date).toLocaleString('en-IN')}</span>
                </div>
                <h3 className="font-headline font-black text-lg uppercase tracking-tight text-[#e4e1e9]">
                  {match.team1.name} <span className="text-[#444650] font-light">vs</span> <span className="text-[#ffd700]">{match.team2?.name || 'TBD'}</span>
                </h3>
                <p className="text-xs text-[#c4c6d0]/50 mt-1">📍 {match.venue}</p>
                {match.result && (
                  <div className="mt-3 bg-emerald-400/5 border border-emerald-400/20 px-4 py-2 inline-block">
                    <p className="text-sm font-headline font-bold text-emerald-400">
                      {match.score1 && `${match.team1.name}: ${match.score1}`}
                      {match.score2 && ` | ${match.team2?.name}: ${match.score2}`}
                    </p>
                    {match.winner && <p className="text-xs text-[#ffd700] mt-1">🏆 Winner: {match.winner}</p>}
                    <p className="text-xs text-[#c4c6d0]/50">{match.result}</p>
                  </div>
                )}
              </div>

              <div className="flex-shrink-0">
                {editingId === match.id ? (
                  <div className="space-y-2 min-w-[220px]">
                    <input className={inputCls} placeholder={`${match.team1.name} score`} value={resultForm.score1} onChange={e => setResultForm({ ...resultForm, score1: e.target.value })} />
                    <input className={inputCls} placeholder={`${match.team2?.name || 'Team 2'} score`} value={resultForm.score2} onChange={e => setResultForm({ ...resultForm, score2: e.target.value })} />
                    <input className={inputCls} placeholder="Winner team name" value={resultForm.winner} onChange={e => setResultForm({ ...resultForm, winner: e.target.value })} />
                    <input className={inputCls} placeholder="Result summary" value={resultForm.result} onChange={e => setResultForm({ ...resultForm, result: e.target.value })} />
                    <div className="flex gap-2">
                      <button onClick={() => saveResult(match.id)} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-1.5 text-sm font-headline font-bold uppercase flex items-center justify-center gap-1 transition-colors">
                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>check</span> Save
                      </button>
                      <button onClick={() => setEditingId(null)} className="flex-1 border border-[#444650]/40 text-[#c4c6d0] py-1.5 text-sm font-headline font-bold uppercase flex items-center justify-center gap-1 hover:border-[#ffd700] hover:text-[#ffd700] transition-all">
                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>close</span> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => { setEditingId(match.id); setResultForm({ score1: match.score1 || '', score2: match.score2 || '', winner: match.winner || '', result: match.result || '' }) }}
                    className="flex items-center gap-2 border border-[#444650]/40 text-[#c4c6d0] px-4 py-2 text-sm font-headline font-bold uppercase hover:border-[#ffd700] hover:text-[#ffd700] transition-all">
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>edit</span>
                    {match.result ? 'Update Result' : 'Enter Result'}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        {matches.length === 0 && (
          <div className="text-center py-16 border border-[#444650]/20 bg-[#131318]">
            <span className="material-symbols-outlined text-[#ffd700]/20 block mb-3" style={{ fontSize: '48px' }}>scoreboard</span>
            <p className="font-headline font-bold uppercase tracking-widest text-[#c4c6d0]/40">No matches scheduled for {district} district yet</p>
          </div>
        )}
      </div>

      <div className="mt-10 -mx-4">
        <SponsorStrip />
      </div>
    </div>
  )
}
