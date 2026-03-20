'use client'

import { useEffect, useState } from 'react'
import { Calendar, MapPin, Clock, Users, Trophy } from 'lucide-react'
import SponsorStrip from '@/components/SponsorStrip'

interface Match {
  id: string
  phase: string
  venue: string
  date: string
  result?: string
  winner?: string
  score1?: string
  score2?: string
  team1: { name: string; district: string }
  team2?: { name: string; district: string }
}

const phaseColors: Record<string, string> = {
  DISTRICT: 'bg-blue-100 text-blue-700',
  ZONAL: 'bg-purple-100 text-purple-700',
  SEMI_FINAL: 'bg-orange-100 text-orange-700',
  FINAL: 'bg-gold-100 text-gold-700',
}

export default function Schedule() {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [activePhase, setActivePhase] = useState('ALL')

  useEffect(() => {
    fetch('/api/schedule')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setMatches(data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const phases = ['ALL', 'DISTRICT', 'ZONAL', 'SEMI_FINAL', 'FINAL']
  const filtered = activePhase === 'ALL' ? matches : matches.filter(m => m.phase === activePhase)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="page-hero">
        <div className="container mx-auto px-4 text-center">
          <h1 className="page-hero-title">District-wise Schedule</h1>
          <p className="page-hero-sub">SPL Tournament Match Schedule Across Uttar Pradesh</p>
        </div>
      </div>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">

          {/* Tournament Timeline */}
          <div className="card mb-8">
            <h2 className="text-2xl font-semibold mb-6 text-primary-600">Tournament Timeline</h2>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { week: 'Week 1-2', label: 'District Level Matches', icon: Calendar, color: 'primary' },
                { week: 'Week 3', label: 'Zonal Championships', icon: Users, color: 'gold' },
                { week: 'Week 4', label: 'State Semi-Finals', icon: MapPin, color: 'green' },
                { week: 'Final', label: 'Ekana Stadium', icon: Trophy, color: 'purple' },
              ].map(item => (
                <div key={item.week} className={`text-center p-4 bg-${item.color}-50 rounded-lg`}>
                  <item.icon className={`w-8 h-8 text-${item.color}-500 mx-auto mb-3`} />
                  <h3 className={`font-semibold text-${item.color}-600 mb-2`}>{item.week}</h3>
                  <p className="text-sm text-gray-600">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Live Fixtures from DB */}
          <div className="card mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
              <h2 className="text-2xl font-semibold text-primary-600">Match Fixtures</h2>
              <div className="flex flex-wrap gap-2">
                {phases.map(p => (
                  <button
                    key={p}
                    onClick={() => setActivePhase(p)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${activePhase === p ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    {p.replace('_', ' ')} {p !== 'ALL' && `(${matches.filter(m => m.phase === p).length})`}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500"></div>
              </div>
            ) : filtered.length > 0 ? (
              <div className="space-y-4">
                {filtered.map(match => (
                  <div key={match.id} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${phaseColors[match.phase] || 'bg-gray-100 text-gray-600'}`}>
                            {match.phase.replace('_', ' ')}
                          </span>
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(match.date).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {match.team1.name} <span className="text-gray-400 font-normal text-base">vs</span> {match.team2?.name || 'TBD'}
                        </h3>
                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3" /> {match.venue}
                        </p>
                      </div>
                      {match.result ? (
                        <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-center min-w-[160px]">
                          {match.score1 && <p className="text-sm font-medium text-gray-700">{match.team1.name}: {match.score1}</p>}
                          {match.score2 && <p className="text-sm font-medium text-gray-700">{match.team2?.name}: {match.score2}</p>}
                          {match.winner && <p className="text-xs text-green-700 font-semibold mt-1">🏆 {match.winner}</p>}
                          <p className="text-xs text-gray-500 mt-1">{match.result}</p>
                        </div>
                      ) : (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 text-center min-w-[120px]">
                          <p className="text-sm font-semibold text-yellow-700">Upcoming</p>
                          <p className="text-xs text-gray-500 mt-1">Result awaited</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <Calendar className="w-12 h-12 mx-auto mb-3 opacity-40" />
                <p>No fixtures scheduled yet. Check back soon.</p>
              </div>
            )}
          </div>

          {/* Final Venue Info */}
          <div className="card">
            <h2 className="text-2xl font-semibold mb-6 text-green-600">Grand Final</h2>
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-8 rounded-lg text-center">
              <MapPin className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-green-600 mb-2">Ekana Cricket Stadium, Lucknow</h3>
              <p className="text-gray-600">The biggest U19 cricket final in Uttar Pradesh</p>
              <div className="mt-4 p-4 bg-white rounded-lg inline-block">
                <p className="text-sm text-gray-600"><strong>Prize:</strong> ₹11,00,000 | <strong>Scholarship:</strong> 50% at Saroj International University</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SponsorStrip />
    </div>
  )
}
