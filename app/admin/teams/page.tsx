'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, Eye, Users, X, FileText } from 'lucide-react'

interface Player {
  id: string; name: string; phone: string; role: string
  aadhaarDoc?: string; schoolIdDoc?: string; dobProofDoc?: string; photoDoc?: string
}

interface Team {
  id: string; name: string; district: string; schoolCollege: string
  status: string; registrationId: string; createdAt: string
  coachName?: string; coachPhone?: string; managerName?: string; managerPhone?: string
  contactEmail?: string; contactPhone?: string
  _count: { players: number }
  payments: { status: string; amount: number }[]
  players: Player[]
}

export default function AdminTeams() {
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')
  const [viewTeam, setViewTeam] = useState<Team | null>(null)

  useEffect(() => { loadTeams() }, [])

  const loadTeams = async () => {
    try {
      const token = localStorage.getItem('adminToken') || ''
      const data = await fetch('/api/admin/teams', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json())
      setTeams(data)
    } catch { } finally { setLoading(false) }
  }

  const updateTeamStatus = async (teamId: string, status: string) => {
    const token = localStorage.getItem('adminToken') || ''
    await fetch('/api/admin/teams', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ teamId, status })
    })
    loadTeams()
    if (viewTeam?.id === teamId) setViewTeam(prev => prev ? { ...prev, status } : null)
  }

  const filtered = teams.filter(t => filter === 'ALL' || t.status === filter)

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div></div>

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary-600">Team Management</h1>
        <p className="text-gray-600">Manage team registrations, documents and approvals</p>
      </div>

      {/* Doc Viewer Modal */}
      {viewTeam && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
              <div>
                <h2 className="text-xl font-bold text-primary-600">{viewTeam.name}</h2>
                <p className="text-sm text-gray-500">{viewTeam.registrationId} • {viewTeam.district} • {viewTeam.schoolCollege}</p>
              </div>
              <button onClick={() => setViewTeam(null)} className="text-gray-400 hover:text-gray-600"><X className="w-6 h-6" /></button>
            </div>
            <div className="p-6 space-y-6">
              {/* Team Info */}
              <div className="grid grid-cols-2 gap-3 text-sm bg-gray-50 rounded-lg p-4">
                {viewTeam.coachName && <div><span className="text-gray-500">Coach:</span> <span className="font-medium">{viewTeam.coachName}</span> {viewTeam.coachPhone && `(${viewTeam.coachPhone})`}</div>}
                {viewTeam.managerName && <div><span className="text-gray-500">Manager:</span> <span className="font-medium">{viewTeam.managerName}</span> {viewTeam.managerPhone && `(${viewTeam.managerPhone})`}</div>}
                {viewTeam.contactEmail && <div><span className="text-gray-500">Email:</span> <span className="font-medium">{viewTeam.contactEmail}</span></div>}
                <div><span className="text-gray-500">Payment:</span> <span className={`font-semibold ${viewTeam.payments?.[0]?.status === 'COMPLETED' ? 'text-green-600' : 'text-yellow-600'}`}>{viewTeam.payments?.[0]?.status || 'PENDING'}</span></div>
              </div>

              {/* Players & Docs */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Players & Documents ({viewTeam.players?.length || 0})</h3>
                <div className="space-y-3">
                  {viewTeam.players?.map((player, i) => (
                    <div key={player.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="font-medium text-gray-900">{i + 1}. {player.name}</span>
                          <span className="ml-2 text-xs text-gray-500">{player.phone}</span>
                        </div>
                        <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">{player.role}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {player.aadhaarDoc
                          ? <a href={player.aadhaarDoc} target="_blank" rel="noopener noreferrer" className="text-xs bg-blue-50 text-blue-600 border border-blue-200 px-2 py-1 rounded hover:bg-blue-100">📄 Aadhaar</a>
                          : <span className="text-xs bg-red-50 text-red-400 border border-red-200 px-2 py-1 rounded">❌ Aadhaar missing</span>}
                        {player.schoolIdDoc
                          ? <a href={player.schoolIdDoc} target="_blank" rel="noopener noreferrer" className="text-xs bg-blue-50 text-blue-600 border border-blue-200 px-2 py-1 rounded hover:bg-blue-100">📄 School ID</a>
                          : <span className="text-xs bg-red-50 text-red-400 border border-red-200 px-2 py-1 rounded">❌ School ID missing</span>}
                        {player.dobProofDoc
                          ? <a href={player.dobProofDoc} target="_blank" rel="noopener noreferrer" className="text-xs bg-blue-50 text-blue-600 border border-blue-200 px-2 py-1 rounded hover:bg-blue-100">📄 DOB Proof</a>
                          : <span className="text-xs bg-red-50 text-red-400 border border-red-200 px-2 py-1 rounded">❌ DOB Proof missing</span>}
                        {player.photoDoc
                          ? <a href={player.photoDoc} target="_blank" rel="noopener noreferrer" className="text-xs bg-blue-50 text-blue-600 border border-blue-200 px-2 py-1 rounded hover:bg-blue-100">📄 Photo</a>
                          : <span className="text-xs bg-red-50 text-red-400 border border-red-200 px-2 py-1 rounded">❌ Photo missing</span>}
                      </div>
                    </div>
                  ))}
                  {(!viewTeam.players || viewTeam.players.length === 0) && <p className="text-sm text-gray-400">No players found</p>}
                </div>
              </div>

              {/* Actions */}
              {viewTeam.status === 'PENDING' && (
                <div className="flex gap-3 pt-2 border-t">
                  <button onClick={() => updateTeamStatus(viewTeam.id, 'APPROVED')} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4" /> Approve Team
                  </button>
                  <button onClick={() => updateTeamStatus(viewTeam.id, 'REJECTED')} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2">
                    <XCircle className="w-4 h-4" /> Reject Team
                  </button>
                </div>
              )}
              {viewTeam.status !== 'PENDING' && (
                <div className={`text-center py-2 rounded-lg font-semibold text-sm ${viewTeam.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  Team is {viewTeam.status}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map(s => (
          <button key={s} onClick={() => setFilter(s)} className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === s ? 'bg-primary-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'}`}>
            {s} ({teams.filter(t => s === 'ALL' || t.status === s).length})
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Team</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">District</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Players</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filtered.map(team => (
                <tr key={team.id}>
                  <td className="px-4 py-4">
                    <div className="font-medium text-gray-900 text-sm">{team.name}</div>
                    <div className="text-xs text-gray-500">{team.registrationId}</div>
                    <div className="text-xs text-gray-500">{team.schoolCollege}</div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700">{team.district}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1 text-sm text-gray-700">
                      <Users className="w-4 h-4" /> {team._count?.players || 0}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${team.payments?.[0]?.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {team.payments?.[0]?.status || 'PENDING'}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${team.status === 'APPROVED' ? 'bg-green-100 text-green-800' : team.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {team.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 space-x-2 whitespace-nowrap">
                    <button onClick={() => setViewTeam(team)} className="text-blue-600 hover:text-blue-800" title="View Documents">
                      <FileText className="w-5 h-5" />
                    </button>
                    {team.status === 'PENDING' && (
                      <>
                        <button onClick={() => updateTeamStatus(team.id, 'APPROVED')} className="text-green-600 hover:text-green-800" title="Approve"><CheckCircle className="w-5 h-5" /></button>
                        <button onClick={() => updateTeamStatus(team.id, 'REJECTED')} className="text-red-500 hover:text-red-700" title="Reject"><XCircle className="w-5 h-5" /></button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">No teams found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
