'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { UserPlus, FileCheck } from 'lucide-react'

interface Player {
  id: string; name: string; fatherName?: string; phone: string; district: string
  schoolCollege: string; role: string; position?: string; experience?: string
  aadhaarDoc?: string; schoolIdDoc?: string; dobProofDoc?: string; photoDoc?: string
}
interface Team { id: string; name: string }

export default function CoordinatorPlayers() {
  const [players, setPlayers] = useState<Player[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [district, setDistrict] = useState('')
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)
  const [assignTeamId, setAssignTeamId] = useState('')
  const [assigning, setAssigning] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('coordinatorToken')
    const dist = localStorage.getItem('coordinatorDistrict') || ''
    if (!token) { router.push('/coordinator/login'); return }
    setDistrict(dist)
    loadData(dist)
  }, [])

  const loadData = async (dist: string) => {
    const token = localStorage.getItem('coordinatorToken') || ''
    const headers = { Authorization: `Bearer ${token}` }
    const [pRes, tRes] = await Promise.all([
      fetch(`/api/coordinator/players?district=${encodeURIComponent(dist)}`, { headers }),
      fetch(`/api/coordinator/teams?district=${encodeURIComponent(dist)}`, { headers })
    ])
    setPlayers(await pRes.json())
    setTeams(await tRes.json())
    setLoading(false)
  }

  const assignPlayer = async () => {
    if (!selectedPlayer || !assignTeamId) return
    setAssigning(true)
    const token = localStorage.getItem('coordinatorToken') || ''
    await fetch('/api/coordinator/assign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ playerId: selectedPlayer.id, teamId: assignTeamId })
    })
    setAssigning(false)
    setSelectedPlayer(null)
    setAssignTeamId('')
    loadData(district)
  }

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div></div>

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-primary-600">Unassigned Players</h1>
          <p className="text-sm text-gray-500">{district} District — {players.length} players waiting for team assignment</p>
        </div>
        <button onClick={() => router.push('/coordinator/dashboard')} className="text-gray-600 hover:text-primary-600 text-sm">← Dashboard</button>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Assign Modal */}
        {selectedPlayer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <h2 className="text-xl font-bold mb-4 text-primary-600">Assign Player to Team</h2>
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="font-semibold text-gray-900">{selectedPlayer.name}</p>
                <p className="text-sm text-gray-500">{selectedPlayer.role} • {selectedPlayer.schoolCollege}</p>
              </div>
              <div className="mb-4">
                <label className="form-label">Select Team</label>
                <select className="form-input" value={assignTeamId} onChange={e => setAssignTeamId(e.target.value)}>
                  <option value="">Choose a team</option>
                  {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
              <div className="flex gap-3">
                <button onClick={assignPlayer} disabled={!assignTeamId || assigning} className="btn-primary disabled:opacity-50 flex-1">{assigning ? 'Assigning...' : 'Assign'}</button>
                <button onClick={() => { setSelectedPlayer(null); setAssignTeamId('') }} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex-1">Cancel</button>
              </div>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {players.map(player => (
            <div key={player.id} className="card">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{player.name}</h3>
                  {player.fatherName && <p className="text-xs text-gray-500">S/O {player.fatherName}</p>}
                </div>
                <span className="bg-primary-100 text-primary-700 text-xs font-semibold px-2 py-1 rounded-full">{player.role}</span>
              </div>
              <div className="space-y-1 text-sm text-gray-600 mb-4">
                <p>📱 {player.phone}</p>
                <p>🏫 {player.schoolCollege}</p>
                {player.position && <p>🏏 {player.position.replace('_', ' ')}</p>}
                {player.experience && <p>⭐ {player.experience}</p>}
              </div>
              <div className="flex gap-2 mb-3">
                {player.aadhaarDoc && <a href={player.aadhaarDoc} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 flex items-center gap-1"><FileCheck className="w-3 h-3" />Aadhaar</a>}
                {player.schoolIdDoc && <a href={player.schoolIdDoc} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 flex items-center gap-1"><FileCheck className="w-3 h-3" />School ID</a>}
              </div>
              <button onClick={() => setSelectedPlayer(player)} className="w-full btn-primary flex items-center justify-center gap-2 text-sm py-2">
                <UserPlus className="w-4 h-4" /> Assign to Team
              </button>
            </div>
          ))}
          {players.length === 0 && (
            <div className="col-span-3 text-center py-12 text-gray-400">No unassigned players in {district} district</div>
          )}
        </div>
      </div>
    </div>
  )
}
