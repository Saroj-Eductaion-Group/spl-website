'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, XCircle, Eye, Users } from 'lucide-react'

interface Team {
  id: string; name: string; district: string; schoolCollege: string
  status: string; registrationId: string; createdAt: string
  _count: { players: number }
  payments: { status: string; amount: number }[]
}

export default function CoordinatorTeams() {
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')
  const [district, setDistrict] = useState('')
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('coordinatorToken')
    const dist = localStorage.getItem('coordinatorDistrict') || ''
    if (!token) { router.push('/coordinator/login'); return }
    setDistrict(dist)
    loadTeams(dist)
  }, [])

  const loadTeams = async (dist: string) => {
    const token = localStorage.getItem('coordinatorToken') || ''
    const res = await fetch(`/api/coordinator/teams?district=${encodeURIComponent(dist)}`, { headers: { Authorization: `Bearer ${token}` } })
    setTeams(await res.json())
    setLoading(false)
  }

  const updateStatus = async (teamId: string, status: string) => {
    const token = localStorage.getItem('coordinatorToken') || ''
    await fetch('/api/coordinator/teams', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ teamId, status })
    })
    loadTeams(district)
  }

  const filtered = teams.filter(t => filter === 'ALL' || t.status === filter)

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div></div>

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-primary-600">District Teams</h1>
          <p className="text-sm text-gray-500">{district} District</p>
        </div>
        <button onClick={() => router.push('/coordinator/dashboard')} className="text-gray-600 hover:text-primary-600 text-sm">← Dashboard</button>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-3 mb-6 flex-wrap">
          {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map(s => (
            <button key={s} onClick={() => setFilter(s)} className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === s ? 'bg-primary-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'}`}>
              {s} ({teams.filter(t => s === 'ALL' || t.status === s).length})
            </button>
          ))}
        </div>

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Team</th>
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
                    <td className="px-4 py-4 space-x-2">
                      {team.status === 'PENDING' && (
                        <>
                          <button onClick={() => updateStatus(team.id, 'APPROVED')} className="text-green-600 hover:text-green-800" title="Approve"><CheckCircle className="w-5 h-5" /></button>
                          <button onClick={() => updateStatus(team.id, 'REJECTED')} className="text-red-500 hover:text-red-700" title="Reject"><XCircle className="w-5 h-5" /></button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">No teams found</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
