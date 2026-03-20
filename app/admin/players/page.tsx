'use client'

import { useEffect, useState } from 'react'

interface Player {
  id: string; name: string; district: string; schoolCollege: string
  role: string; isIndividual: boolean; teamAssigned: boolean; createdAt: string
  aadhaarDoc?: string; schoolIdDoc?: string; dobProofDoc?: string; photoDoc?: string
}
interface Team { id: string; name: string; district: string }

const inputCls = "w-full bg-[#0b0b0f] border border-[#444650]/40 text-[#e4e1e9] px-4 py-3 text-sm font-body placeholder:text-[#444650] focus:outline-none focus:border-[#ffd700]/60 transition-colors"
const labelCls = "block text-xs font-headline font-bold uppercase tracking-widest text-[#c4c6d0] mb-2"

export default function AdminPlayers() {
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [assignPlayer, setAssignPlayer] = useState<Player | null>(null)
  const [teams, setTeams] = useState<Team[]>([])
  const [assignTeamId, setAssignTeamId] = useState('')
  const [assigning, setAssigning] = useState(false)

  useEffect(() => { loadPlayers() }, [])

  const loadPlayers = async () => {
    try {
      const token = localStorage.getItem('adminToken') || ''
      const [pRes, tRes] = await Promise.all([
        fetch('/api/admin/players', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/admin/teams', { headers: { Authorization: `Bearer ${token}` } })
      ])
      setPlayers(await pRes.json())
      setTeams(await tRes.json())
    } catch (error) {
      console.error('Failed to load players:', error)
    } finally {
      setLoading(false)
    }
  }

  const doAssign = async () => {
    if (!assignPlayer || !assignTeamId) return
    setAssigning(true)
    const token = localStorage.getItem('adminToken') || ''
    await fetch('/api/coordinator/assign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ playerId: assignPlayer.id, teamId: assignTeamId })
    })
    setAssigning(false)
    setAssignPlayer(null)
    setAssignTeamId('')
    loadPlayers()
  }

  const filteredPlayers = players.filter(player => {
    if (filter === 'INDIVIDUAL') return player.isIndividual && !player.teamAssigned
    if (filter === 'ASSIGNED') return player.isIndividual && player.teamAssigned
    if (filter === 'TEAM_PLAYERS') return !player.isIndividual
    return true
  })

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <span className="w-8 h-8 border-2 border-[#444650] border-t-[#ffd700] rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* Assign Modal */}
      {assignPlayer && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#131318] border border-[#444650]/30 max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="font-headline font-black text-xl uppercase tracking-tight text-[#ffd700]">Assign Player to Team</h2>
              <button onClick={() => { setAssignPlayer(null); setAssignTeamId('') }} className="text-[#c4c6d0]/40 hover:text-[#ffd700] transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="bg-[#0b0b0f] border border-[#444650]/20 p-4 mb-5">
              <p className="font-headline font-bold text-[#e4e1e9]">{assignPlayer.name}</p>
              <p className="text-xs text-[#c4c6d0]/60 mt-1">{assignPlayer.role} • {assignPlayer.district} • {assignPlayer.schoolCollege}</p>
            </div>
            <div className="mb-5">
              <label className={labelCls}>Select Team</label>
              <select className={inputCls} value={assignTeamId} onChange={e => setAssignTeamId(e.target.value)}>
                <option value="">Choose a team</option>
                {teams.filter(t => t.district === assignPlayer.district).map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
                {teams.filter(t => t.district !== assignPlayer.district).length > 0 && (
                  <optgroup label="Other Districts">
                    {teams.filter(t => t.district !== assignPlayer.district).map(t => (
                      <option key={t.id} value={t.id}>{t.name} ({t.district})</option>
                    ))}
                  </optgroup>
                )}
              </select>
            </div>
            <div className="flex gap-3">
              <button onClick={doAssign} disabled={!assignTeamId || assigning}
                className="flex-1 bg-[#ffd700] text-[#002366] py-2.5 font-headline font-black uppercase tracking-tight text-sm hover:brightness-110 transition-all disabled:opacity-50">
                {assigning ? 'Assigning...' : 'Assign'}
              </button>
              <button onClick={() => { setAssignPlayer(null); setAssignTeamId('') }}
                className="flex-1 border border-[#444650]/40 text-[#c4c6d0] py-2.5 font-headline font-bold uppercase tracking-tight text-sm hover:border-[#ffd700] hover:text-[#ffd700] transition-all">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-8">
        <h1 className="font-headline font-black text-3xl italic uppercase tracking-tighter text-[#e4e1e9]">Player <span className="text-[#ffd700]">Management</span></h1>
        <p className="text-[#c4c6d0]/60 text-sm mt-1">Manage individual players and team assignments</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        {[
          { key: 'ALL', label: 'All Players' },
          { key: 'INDIVIDUAL', label: 'Unassigned Individual' },
          { key: 'ASSIGNED', label: 'Assigned Individual' },
          { key: 'TEAM_PLAYERS', label: 'Team Players' }
        ].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`px-4 py-2 text-xs font-headline font-black uppercase tracking-widest transition-all ${filter === f.key ? 'bg-[#ffd700] text-[#002366]' : 'border border-[#444650]/40 text-[#c4c6d0] hover:border-[#ffd700] hover:text-[#ffd700]'}`}>
            {f.label} ({players.filter(p => {
              if (f.key === 'INDIVIDUAL') return p.isIndividual && !p.teamAssigned
              if (f.key === 'ASSIGNED') return p.isIndividual && p.teamAssigned
              if (f.key === 'TEAM_PLAYERS') return !p.isIndividual
              return true
            }).length})
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-[#131318] border border-[#444650]/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-[#0b0b0f] border-b border-[#444650]/20">
              <tr>
                {['Player', 'District', 'Role', 'Type', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-[0.6rem] font-headline font-bold uppercase tracking-widest text-[#c4c6d0]/50">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#444650]/10">
              {filteredPlayers.map(player => (
                <tr key={player.id} className="hover:bg-[#1c1c21] transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-headline font-bold text-[#e4e1e9] text-sm">{player.name}</div>
                    <div className="text-xs text-[#c4c6d0]/50">{player.schoolCollege}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#c4c6d0]">{player.district}</td>
                  <td className="px-6 py-4 text-sm text-[#c4c6d0]">{player.role}</td>
                  <td className="px-6 py-4">
                    <span className={`text-[0.6rem] font-headline font-bold uppercase tracking-widest border px-2 py-0.5 ${player.isIndividual ? 'text-[#ffd700] border-[#ffd700]/30' : 'text-violet-400 border-violet-400/30'}`}>
                      {player.isIndividual ? 'Individual' : 'Team Player'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[0.6rem] font-headline font-bold uppercase tracking-widest border px-2 py-0.5 ${
                      player.isIndividual && !player.teamAssigned ? 'text-orange-400 border-orange-400/30' :
                      player.teamAssigned ? 'text-emerald-400 border-emerald-400/30' :
                      'text-[#c4c6d0] border-[#444650]/30'
                    }`}>
                      {player.isIndividual && !player.teamAssigned ? 'Unassigned' : player.teamAssigned ? 'Assigned' : 'In Team'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <button onClick={() => { setSelectedPlayer(player); setShowModal(true) }} className="text-[#c4c6d0]/40 hover:text-[#ffd700] transition-colors" title="View Details">
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>visibility</span>
                      </button>
                      {player.isIndividual && !player.teamAssigned && (
                        <button onClick={() => { setAssignPlayer(player); setAssignTeamId('') }} className="text-emerald-400/60 hover:text-emerald-400 transition-colors" title="Assign to Team">
                          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>person_add</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Player Details Modal */}
      {showModal && selectedPlayer && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#131318] border border-[#444650]/30 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-headline font-black text-2xl uppercase tracking-tighter text-[#ffd700]">Player Details</h2>
                <button onClick={() => setShowModal(false)} className="text-[#c4c6d0]/40 hover:text-[#ffd700] transition-colors">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4 bg-[#0b0b0f] border border-[#444650]/20 p-4">
                  {[
                    { label: 'Name', value: selectedPlayer.name },
                    { label: 'District', value: selectedPlayer.district },
                    { label: 'School/College', value: selectedPlayer.schoolCollege },
                    { label: 'Role', value: selectedPlayer.role },
                  ].map(item => (
                    <div key={item.label}>
                      <label className="text-xs font-headline font-bold uppercase tracking-widest text-[#c4c6d0]/50">{item.label}</label>
                      <p className="text-[#e4e1e9] font-semibold mt-1">{item.value}</p>
                    </div>
                  ))}
                </div>
                <div>
                  <h3 className="font-headline font-bold uppercase tracking-tight text-[#c4c6d0] mb-4 text-sm">Uploaded Documents</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { label: 'Aadhaar Card', url: selectedPlayer.aadhaarDoc },
                      { label: 'School/College ID', url: selectedPlayer.schoolIdDoc },
                      { label: 'Date of Birth Proof', url: selectedPlayer.dobProofDoc },
                      { label: 'Photograph', url: selectedPlayer.photoDoc },
                    ].filter(d => d.url).map(doc => (
                      <div key={doc.label} className="border border-[#444650]/20 bg-[#0b0b0f] p-4">
                        <label className="text-xs font-headline font-bold uppercase tracking-widest text-[#c4c6d0]/50 block mb-2">{doc.label}</label>
                        <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-[#ffd700] hover:underline flex items-center gap-2 text-sm">
                          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>fact_check</span> View Document
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
