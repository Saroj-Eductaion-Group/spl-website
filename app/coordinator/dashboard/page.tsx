'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

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
      <span className="w-8 h-8 border-2 border-[#444650] border-t-[#ffd700] rounded-full animate-spin" />
    </div>
  )

  const metrics = [
    { label: 'District Teams',    value: stats.districtTeams,        icon: 'groups',      color: 'text-[#ffd700]',   bg: 'bg-[#ffd700]/10',   border: 'border-[#ffd700]/20'   },
    { label: 'Pending Approvals', value: stats.pendingVerifications,  icon: 'pending',     color: 'text-orange-400',  bg: 'bg-orange-400/10',  border: 'border-orange-400/20'  },
    { label: 'Approved Teams',    value: stats.approvedTeams,         icon: 'check_circle',color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' },
    { label: 'Unassigned Players',value: stats.individualPlayers,     icon: 'person_add',  color: 'text-violet-400',  bg: 'bg-violet-400/10',  border: 'border-violet-400/20'  },
  ]

  const actions = [
    { href: '/coordinator/teams',   icon: 'groups',      label: 'Manage Teams',       desc: 'View, approve or reject district teams',    badge: stats.districtTeams,       badgeColor: 'text-[#ffd700] bg-[#ffd700]/10'     },
    { href: '/coordinator/players', icon: 'person_check',label: 'Individual Players', desc: 'Assign unassigned players to teams',         badge: stats.individualPlayers,   badgeColor: 'text-violet-400 bg-violet-400/10'   },
    { href: '/coordinator/results', icon: 'scoreboard',  label: 'Match Results',      desc: 'Update scores and match results',            badge: 'Update',                  badgeColor: 'text-emerald-400 bg-emerald-400/10' },
    { href: '/coordinator/teams',   icon: 'pending',     label: 'Pending Approvals',  desc: `${stats.pendingVerifications} teams waiting`, badge: stats.pendingVerifications, badgeColor: 'text-orange-400 bg-orange-400/10'   },
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="font-headline font-black text-4xl italic uppercase tracking-tighter text-[#e4e1e9]">
          Coordinator <span className="text-[#ffd700]">Dashboard</span>
        </h1>
        <p className="text-[#c4c6d0]/60 text-sm mt-1 font-body">{district} District — Team Management</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map(m => (
          <div key={m.label} className="bg-[#131318] border border-[#444650]/20 p-5">
            <div className={`w-10 h-10 ${m.bg} border ${m.border} flex items-center justify-center mb-4`}>
              <span className={`material-symbols-outlined ${m.color}`} style={{ fontSize: '20px' }}>{m.icon}</span>
            </div>
            <div className={`text-3xl font-headline font-black ${m.color} mb-1`}>{m.value}</div>
            <div className="text-xs font-headline font-bold uppercase tracking-widest text-[#c4c6d0]/50">{m.label}</div>
          </div>
        ))}
      </div>

      <div>
        <h2 className="font-headline font-black text-xl uppercase tracking-tight text-[#e4e1e9] mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {actions.map(a => (
            <button key={a.href + a.label} onClick={() => router.push(a.href)}
              className="bg-[#131318] border border-[#444650]/20 p-5 hover:border-[#ffd700]/30 hover:bg-[#1c1c21] transition-all group text-left">
              <div className="flex items-center justify-between mb-4">
                <span className="material-symbols-outlined text-[#ffd700]/60 group-hover:text-[#ffd700] transition-colors" style={{ fontSize: '28px' }}>{a.icon}</span>
                <span className={`text-xs font-headline font-bold px-2 py-0.5 ${a.badgeColor}`}>{a.badge}</span>
              </div>
              <h3 className="font-headline font-black text-sm uppercase tracking-tight text-[#e4e1e9] mb-1 group-hover:text-[#ffd700] transition-colors">{a.label}</h3>
              <p className="text-xs text-[#c4c6d0]/50 font-body leading-relaxed">{a.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
