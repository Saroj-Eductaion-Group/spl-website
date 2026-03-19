'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Users, FileCheck, Trophy, Calendar } from 'lucide-react'

export default function CoordinatorDashboard() {
  const [stats, setStats] = useState({ districtTeams: 0, pendingVerifications: 0, approvedTeams: 0, individualPlayers: 0 })
  const [district, setDistrict] = useState('')
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('coordinatorToken')
    const dist = localStorage.getItem('coordinatorDistrict') || ''
    if (!token) { router.push('/coordinator/login'); return }
    setDistrict(dist)
    loadStats(dist)
  }, [])

  const loadStats = async (dist: string) => {
    try {
      const token = localStorage.getItem('coordinatorToken') || ''
      const headers = { Authorization: `Bearer ${token}` }
      const [teamsRes, playersRes] = await Promise.all([
        fetch(`/api/coordinator/teams?district=${encodeURIComponent(dist)}`, { headers }),
        fetch(`/api/coordinator/players?district=${encodeURIComponent(dist)}`, { headers })
      ])
      const teams = await teamsRes.json()
      const players = await playersRes.json()
      setStats({
        districtTeams: teams.length,
        pendingVerifications: teams.filter((t: { status: string }) => t.status === 'PENDING').length,
        approvedTeams: teams.filter((t: { status: string }) => t.status === 'APPROVED').length,
        individualPlayers: players.length
      })
    } catch (e) {
      console.error('Failed to load stats:', e)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Coordinator Dashboard</h1>
        <p className="text-gray-500">{district} District — Team Management</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card"><div className="flex items-center"><Users className="h-8 w-8 text-primary-500" /><div className="ml-4"><p className="text-sm font-medium text-gray-600">District Teams</p><p className="text-2xl font-bold text-gray-900">{stats.districtTeams}</p></div></div></div>
        <div className="card"><div className="flex items-center"><FileCheck className="h-8 w-8 text-orange-500" /><div className="ml-4"><p className="text-sm font-medium text-gray-600">Pending Approvals</p><p className="text-2xl font-bold text-gray-900">{stats.pendingVerifications}</p></div></div></div>
        <div className="card"><div className="flex items-center"><Trophy className="h-8 w-8 text-green-500" /><div className="ml-4"><p className="text-sm font-medium text-gray-600">Approved Teams</p><p className="text-2xl font-bold text-gray-900">{stats.approvedTeams}</p></div></div></div>
        <div className="card"><div className="flex items-center"><Calendar className="h-8 w-8 text-yellow-500" /><div className="ml-4"><p className="text-sm font-medium text-gray-600">Unassigned Players</p><p className="text-2xl font-bold text-gray-900">{stats.individualPlayers}</p></div></div></div>
      </div>

      {/* Action Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <button onClick={() => router.push('/coordinator/teams')} className="card hover:shadow-lg transition-shadow text-center group">
          <Users className="h-10 w-10 text-primary-500 mx-auto mb-3 group-hover:text-primary-600" />
          <h3 className="text-lg font-semibold mb-2">Manage Teams</h3>
          <p className="text-gray-600 text-sm mb-4">View, approve or reject district teams</p>
          <span className="btn-primary text-sm py-2 px-4">View Teams</span>
        </button>

        <button onClick={() => router.push('/coordinator/players')} className="card hover:shadow-lg transition-shadow text-center group">
          <FileCheck className="h-10 w-10 text-orange-500 mx-auto mb-3 group-hover:text-orange-600" />
          <h3 className="text-lg font-semibold mb-2">Individual Players</h3>
          <p className="text-gray-600 text-sm mb-4">Assign unassigned players to teams</p>
          <span className="btn-primary text-sm py-2 px-4">Manage Players</span>
        </button>

        <button onClick={() => router.push('/coordinator/results')} className="card hover:shadow-lg transition-shadow text-center group">
          <Trophy className="h-10 w-10 text-green-500 mx-auto mb-3 group-hover:text-green-600" />
          <h3 className="text-lg font-semibold mb-2">Match Results</h3>
          <p className="text-gray-600 text-sm mb-4">Update scores and match results</p>
          <span className="btn-primary text-sm py-2 px-4">Update Results</span>
        </button>

        <button onClick={() => router.push('/coordinator/teams')} className="card hover:shadow-lg transition-shadow text-center group bg-orange-50 border-2 border-orange-200">
          <Calendar className="h-10 w-10 text-orange-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold mb-2">Pending Approvals</h3>
          <p className="text-gray-600 text-sm mb-4">{stats.pendingVerifications} teams waiting for review</p>
          <span className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">Review Now</span>
        </button>
      </div>
    </div>
  )
}
