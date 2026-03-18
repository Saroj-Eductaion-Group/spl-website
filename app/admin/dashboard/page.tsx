'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Users, Trophy, CreditCard, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react'

interface DashboardStats {
  totalTeams: number
  totalPlayers: number
  totalPayments: number
  pendingApprovals: number
  approvedTeams: number
  rejectedTeams: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin/login')
      return
    }
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const token = localStorage.getItem('adminToken') || ''
      const response = await fetch('/api/admin/dashboard', { headers: { Authorization: `Bearer ${token}` } })
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    router.push('/admin/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary-600 mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome to SPL Tournament Management System</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Trophy className="h-10 w-10 opacity-80" />
            <span className="text-3xl font-bold">{stats?.totalTeams || 0}</span>
          </div>
          <p className="text-primary-100 text-sm font-medium">Total Teams</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Users className="h-10 w-10 opacity-80" />
            <span className="text-3xl font-bold">{stats?.totalPlayers || 0}</span>
          </div>
          <p className="text-green-100 text-sm font-medium">Total Players</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <CreditCard className="h-10 w-10 opacity-80" />
            <span className="text-3xl font-bold">₹{((stats?.totalPayments || 0) / 100000).toFixed(1)}L</span>
          </div>
          <p className="text-purple-100 text-sm font-medium">Total Revenue</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Clock className="h-10 w-10 opacity-80" />
            <span className="text-3xl font-bold">{stats?.pendingApprovals || 0}</span>
          </div>
          <p className="text-orange-100 text-sm font-medium">Pending Approvals</p>
        </div>
      </div>

      {/* Team Status Overview */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Team Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Approved Teams</p>
                <p className="text-3xl font-bold text-green-600">{stats?.approvedTeams || 0}</p>
              </div>
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
          </div>

          <div className="card border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending Review</p>
                <p className="text-3xl font-bold text-orange-600">{stats?.pendingApprovals || 0}</p>
              </div>
              <Clock className="h-12 w-12 text-orange-500" />
            </div>
          </div>

          <div className="card border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Rejected Teams</p>
                <p className="text-3xl font-bold text-red-600">{stats?.rejectedTeams || 0}</p>
              </div>
              <XCircle className="h-12 w-12 text-red-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <button
            onClick={() => router.push('/admin/teams')}
            className="card hover:shadow-xl transition-all hover:scale-105 text-left group"
          >
            <div className="flex items-center justify-between mb-3">
              <Trophy className="h-8 w-8 text-primary-500 group-hover:text-primary-600" />
              <span className="text-xs bg-primary-100 text-primary-600 px-2 py-1 rounded-full">{stats?.totalTeams || 0}</span>
            </div>
            <h3 className="text-lg font-semibold mb-2 group-hover:text-primary-600">Manage Teams</h3>
            <p className="text-gray-600 text-sm">Approve, reject, and manage team registrations</p>
          </button>

          <button
            onClick={() => router.push('/admin/players')}
            className="card hover:shadow-xl transition-all hover:scale-105 text-left group"
          >
            <div className="flex items-center justify-between mb-3">
              <Users className="h-8 w-8 text-green-500 group-hover:text-green-600" />
              <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">{stats?.totalPlayers || 0}</span>
            </div>
            <h3 className="text-lg font-semibold mb-2 group-hover:text-green-600">Manage Players</h3>
            <p className="text-gray-600 text-sm">Verify documents and manage individual players</p>
          </button>

          <button
            onClick={() => router.push('/admin/reports')}
            className="card hover:shadow-xl transition-all hover:scale-105 text-left group"
          >
            <div className="flex items-center justify-between mb-3">
              <Calendar className="h-8 w-8 text-purple-500 group-hover:text-purple-600" />
              <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">New</span>
            </div>
            <h3 className="text-lg font-semibold mb-2 group-hover:text-purple-600">Reports</h3>
            <p className="text-gray-600 text-sm">Export team lists, payments, and analytics</p>
          </button>

          <button
            onClick={() => router.push('/admin/teams?filter=PENDING')}
            className="card hover:shadow-xl transition-all hover:scale-105 text-left group bg-orange-50 border-2 border-orange-200"
          >
            <div className="flex items-center justify-between mb-3">
              <Clock className="h-8 w-8 text-orange-500 group-hover:text-orange-600" />
              <span className="text-xs bg-orange-200 text-orange-700 px-2 py-1 rounded-full font-semibold">{stats?.pendingApprovals || 0}</span>
            </div>
            <h3 className="text-lg font-semibold mb-2 group-hover:text-orange-600">Pending Approvals</h3>
            <p className="text-gray-600 text-sm">Review and approve pending team registrations</p>
          </button>
        </div>
      </div>
      </div>
  )
}