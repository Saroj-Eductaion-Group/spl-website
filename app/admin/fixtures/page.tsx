'use client'

import { useEffect, useState } from 'react'
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react'

interface Team { id: string; name: string; district: string }
interface Match {
  id: string; phase: string; venue: string; date: string
  result?: string; winner?: string; score1?: string; score2?: string
  team1: Team; team2?: Team
}

const phases = ['DISTRICT', 'ZONAL', 'SEMI_FINAL', 'FINAL']

export default function AdminFixtures() {
  const [matches, setMatches] = useState<Match[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingResult, setEditingResult] = useState<string | null>(null)
  const [form, setForm] = useState({ team1Id: '', team2Id: '', venue: '', date: '', phase: 'DISTRICT', notify: false })
  const [resultForm, setResultForm] = useState({ score1: '', score2: '', winner: '', result: '' })

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    const token = localStorage.getItem('adminToken') || ''
    const headers = { Authorization: `Bearer ${token}` }
    const [matchRes, teamRes] = await Promise.all([
      fetch('/api/admin/fixtures', { headers }),
      fetch('/api/admin/teams', { headers })
    ])
    setMatches(await matchRes.json())
    setTeams(await teamRes.json())
    setLoading(false)
  }

  const createFixture = async () => {
    if (!form.team1Id || !form.venue || !form.date) return alert('Fill all required fields')
    const token = localStorage.getItem('adminToken') || ''
    const res = await fetch('/api/admin/fixtures', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(form)
    })
    if ((await res.json()).success) { setShowForm(false); setForm({ team1Id: '', team2Id: '', venue: '', date: '', phase: 'DISTRICT', notify: false }); loadData() }
  }

  const updateResult = async (matchId: string) => {
    const token = localStorage.getItem('adminToken') || ''
    await fetch('/api/admin/fixtures', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ matchId, ...resultForm })
    })
    setEditingResult(null)
    loadData()
  }

  const deleteFixture = async (matchId: string) => {
    if (!confirm('Delete this fixture?')) return
    const token = localStorage.getItem('adminToken') || ''
    await fetch('/api/admin/fixtures', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ matchId })
    })
    loadData()
  }

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div></div>

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary-600">Fixture Management</h1>
          <p className="text-gray-600">Create and manage match fixtures</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Create Fixture
        </button>
      </div>

      {/* Create Fixture Form */}
      {showForm && (
        <div className="card mb-8">
          <h2 className="text-xl font-semibold mb-4 text-primary-600">New Fixture</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Team 1 *</label>
              <select className="form-input" value={form.team1Id} onChange={e => setForm({ ...form, team1Id: e.target.value })}>
                <option value="">Select Team 1</option>
                {teams.map(t => <option key={t.id} value={t.id}>{t.name} ({t.district})</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">Team 2</label>
              <select className="form-input" value={form.team2Id} onChange={e => setForm({ ...form, team2Id: e.target.value })}>
                <option value="">Select Team 2 (optional)</option>
                {teams.filter(t => t.id !== form.team1Id).map(t => <option key={t.id} value={t.id}>{t.name} ({t.district})</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">Venue *</label>
              <input className="form-input" placeholder="Enter venue" value={form.venue} onChange={e => setForm({ ...form, venue: e.target.value })} />
            </div>
            <div>
              <label className="form-label">Date & Time *</label>
              <input type="datetime-local" className="form-input" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
            </div>
            <div>
              <label className="form-label">Phase</label>
              <select className="form-input" value={form.phase} onChange={e => setForm({ ...form, phase: e.target.value })}>
                {phases.map(p => <option key={p} value={p}>{p.replace('_', ' ')}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2 mt-6">
              <input type="checkbox" id="notify" checked={form.notify} onChange={e => setForm({ ...form, notify: e.target.checked })} />
              <label htmlFor="notify" className="text-sm text-gray-700">Send email notification to teams</label>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={createFixture} className="btn-primary">Create Fixture</button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
          </div>
        </div>
      )}

      {/* Fixtures Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Match</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phase</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Venue</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Result</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {matches.map(match => (
                <tr key={match.id}>
                  <td className="px-4 py-4">
                    <div className="text-sm font-medium text-gray-900">{match.team1.name}</div>
                    <div className="text-xs text-gray-500">vs {match.team2?.name || 'TBD'}</div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-primary-100 text-primary-700">
                      {match.phase.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700">{match.venue}</td>
                  <td className="px-4 py-4 text-sm text-gray-700">{new Date(match.date).toLocaleString('en-IN')}</td>
                  <td className="px-4 py-4">
                    {editingResult === match.id ? (
                      <div className="space-y-2">
                        <input className="form-input text-xs py-1" placeholder="Score 1" value={resultForm.score1} onChange={e => setResultForm({ ...resultForm, score1: e.target.value })} />
                        <input className="form-input text-xs py-1" placeholder="Score 2" value={resultForm.score2} onChange={e => setResultForm({ ...resultForm, score2: e.target.value })} />
                        <input className="form-input text-xs py-1" placeholder="Winner" value={resultForm.winner} onChange={e => setResultForm({ ...resultForm, winner: e.target.value })} />
                        <input className="form-input text-xs py-1" placeholder="Result summary" value={resultForm.result} onChange={e => setResultForm({ ...resultForm, result: e.target.value })} />
                        <div className="flex gap-2">
                          <button onClick={() => updateResult(match.id)} className="text-green-600"><Check className="w-4 h-4" /></button>
                          <button onClick={() => setEditingResult(null)} className="text-red-500"><X className="w-4 h-4" /></button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm">
                        {match.result ? (
                          <span className="text-green-700 font-medium">{match.result}</span>
                        ) : (
                          <span className="text-gray-400 text-xs">No result yet</span>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-4 text-sm space-x-2">
                    <button onClick={() => { setEditingResult(match.id); setResultForm({ score1: match.score1 || '', score2: match.score2 || '', winner: match.winner || '', result: match.result || '' }) }} className="text-blue-600 hover:text-blue-800">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => deleteFixture(match.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {matches.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">No fixtures created yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
