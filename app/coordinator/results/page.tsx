'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Edit2, Check, X } from 'lucide-react'

interface Match {
  id: string; phase: string; venue: string; date: string
  result?: string; winner?: string; score1?: string; score2?: string
  team1: { id: string; name: string; district: string }
  team2?: { id: string; name: string; district: string }
}

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

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div></div>

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-primary-600">Match Results</h1>
          <p className="text-sm text-gray-500">{district} District</p>
        </div>
        <button onClick={() => router.push('/coordinator/dashboard')} className="text-gray-600 hover:text-primary-600 text-sm">← Dashboard</button>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-4">
          {matches.map(match => (
            <div key={match.id} className="card">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">{match.phase.replace('_', ' ')}</span>
                    <span className="text-xs text-gray-500">{new Date(match.date).toLocaleString('en-IN')}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {match.team1.name} <span className="text-gray-400 font-normal">vs</span> {match.team2?.name || 'TBD'}
                  </h3>
                  <p className="text-sm text-gray-500">📍 {match.venue}</p>
                  {match.result && (
                    <div className="mt-2 bg-green-50 rounded-lg px-3 py-2 inline-block">
                      <p className="text-sm font-medium text-green-700">
                        {match.score1 && `${match.team1.name}: ${match.score1}`}
                        {match.score2 && ` | ${match.team2?.name}: ${match.score2}`}
                      </p>
                      {match.winner && <p className="text-xs text-green-600">🏆 Winner: {match.winner}</p>}
                      <p className="text-xs text-gray-500">{match.result}</p>
                    </div>
                  )}
                </div>

                <div className="flex-shrink-0">
                  {editingId === match.id ? (
                    <div className="space-y-2 min-w-[220px]">
                      <input className="form-input text-sm py-1" placeholder={`${match.team1.name} score`} value={resultForm.score1} onChange={e => setResultForm({ ...resultForm, score1: e.target.value })} />
                      <input className="form-input text-sm py-1" placeholder={`${match.team2?.name || 'Team 2'} score`} value={resultForm.score2} onChange={e => setResultForm({ ...resultForm, score2: e.target.value })} />
                      <input className="form-input text-sm py-1" placeholder="Winner team name" value={resultForm.winner} onChange={e => setResultForm({ ...resultForm, winner: e.target.value })} />
                      <input className="form-input text-sm py-1" placeholder="Result summary" value={resultForm.result} onChange={e => setResultForm({ ...resultForm, result: e.target.value })} />
                      <div className="flex gap-2">
                        <button onClick={() => saveResult(match.id)} className="flex-1 bg-green-500 text-white py-1.5 rounded-lg text-sm flex items-center justify-center gap-1"><Check className="w-4 h-4" /> Save</button>
                        <button onClick={() => setEditingId(null)} className="flex-1 border border-gray-300 text-gray-700 py-1.5 rounded-lg text-sm flex items-center justify-center gap-1"><X className="w-4 h-4" /> Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => { setEditingId(match.id); setResultForm({ score1: match.score1 || '', score2: match.score2 || '', winner: match.winner || '', result: match.result || '' }) }}
                      className="flex items-center gap-2 px-4 py-2 border border-primary-300 text-primary-600 rounded-lg hover:bg-primary-50 text-sm"
                    >
                      <Edit2 className="w-4 h-4" /> {match.result ? 'Update Result' : 'Enter Result'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          {matches.length === 0 && (
            <div className="text-center py-12 text-gray-400">No matches scheduled for {district} district yet</div>
          )}
        </div>
      </div>
    </div>
  )
}
