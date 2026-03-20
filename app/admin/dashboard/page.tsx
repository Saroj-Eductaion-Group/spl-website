'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

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
    if (!token) { router.push('/admin/login'); return }
    fetch('/api/admin/dashboard', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(setStats).catch(console.error).finally(() => setLoading(false))
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="w-8 h-8 border-2 border-[#444650] border-t-[#ffd700] rounded-full animate-spin" />
      </div>
    )
  }

  const metrics = [
    { label: 'Total Teams',       value: stats?.totalTeams ?? 0,       icon: 'emoji_events',  color: 'text-[#ffd700]',  bg: 'bg-[#ffd700]/10',  border: 'border-[#ffd700]/20' },
    { label: 'Total Players',     value: stats?.totalPlayers ?? 0,     icon: 'groups',        color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' },
    { label: 'Total Revenue',     value: `₹${((stats?.totalPayments ?? 0) / 100000).toFixed(1)}L`, icon: 'payments', color: 'text-violet-400', bg: 'bg-violet-400/10', border: 'border-violet-400/20' },
    { label: 'Pending Approvals', value: stats?.pendingApprovals ?? 0, icon: 'pending',       color: 'text-orange-400', bg: 'bg-orange-400/10',  border: 'border-orange-400/20' },
  ]

  const statusCards = [
    { label: 'Approved Teams', value: stats?.approvedTeams ?? 0,    icon: 'check_circle', color: 'text-emerald-400', border: 'border-l-emerald-400' },
    { label: 'Pending Review',  value: stats?.pendingApprovals ?? 0, icon: 'schedule',     color: 'text-orange-400',  border: 'border-l-orange-400'  },
    { label: 'Rejected Teams',  value: stats?.rejectedTeams ?? 0,   icon: 'cancel',       color: 'text-red-400',     border: 'border-l-red-400'     },
  ]

  const quickActions = [
    { href: '/admin/teams',              icon: 'emoji_events',  label: 'Manage Teams',       desc: 'Approve, reject & manage registrations', badge: stats?.totalTeams ?? 0,       badgeColor: 'text-[#ffd700] bg-[#ffd700]/10'   },
    { href: '/admin/players',            icon: 'groups',        label: 'Manage Players',     desc: 'Verify documents & individual players',  badge: stats?.totalPlayers ?? 0,     badgeColor: 'text-emerald-400 bg-emerald-400/10' },
    { href: '/admin/reports',            icon: 'bar_chart',     label: 'Reports',            desc: 'Export team lists, payments & analytics', badge: 'Export',                    badgeColor: 'text-violet-400 bg-violet-400/10'   },
    { href: '/admin/teams?filter=PENDING', icon: 'pending',    label: 'Pending Approvals',  desc: 'Review pending team registrations',       badge: stats?.pendingApprovals ?? 0, badgeColor: 'text-orange-400 bg-orange-400/10'   },
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-8">

      {/* Header */}
      <div>
        <h1 className="font-headline font-black text-4xl italic uppercase tracking-tighter text-[#e4e1e9]">
          Dashboard <span className="text-[#ffd700]">Overview</span>
        </h1>
        <p className="text-[#c4c6d0]/60 text-sm mt-1 font-body">Welcome to SPL Tournament Management System</p>
      </div>

      {/* Key Metrics */}
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

      {/* Team Status */}
      <div>
        <h2 className="font-headline font-black text-xl uppercase tracking-tight text-[#e4e1e9] mb-4">Team Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {statusCards.map(s => (
            <div key={s.label} className={`bg-[#131318] border border-[#444650]/20 border-l-4 ${s.border} p-5 flex items-center justify-between`}>
              <div>
                <p className="text-xs font-headline font-bold uppercase tracking-widest text-[#c4c6d0]/50 mb-1">{s.label}</p>
                <p className={`text-4xl font-headline font-black ${s.color}`}>{s.value}</p>
              </div>
              <span className={`material-symbols-outlined ${s.color} opacity-30`} style={{ fontSize: '48px' }}>{s.icon}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="font-headline font-black text-xl uppercase tracking-tight text-[#e4e1e9] mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map(a => (
            <Link key={a.href} href={a.href}
              className="bg-[#131318] border border-[#444650]/20 p-5 hover:border-[#ffd700]/30 hover:bg-[#1c1c21] transition-all group">
              <div className="flex items-center justify-between mb-4">
                <span className="material-symbols-outlined text-[#ffd700]/60 group-hover:text-[#ffd700] transition-colors" style={{ fontSize: '28px' }}>{a.icon}</span>
                <span className={`text-xs font-headline font-bold px-2 py-0.5 ${a.badgeColor}`}>{a.badge}</span>
              </div>
              <h3 className="font-headline font-black text-sm uppercase tracking-tight text-[#e4e1e9] mb-1 group-hover:text-[#ffd700] transition-colors">{a.label}</h3>
              <p className="text-xs text-[#c4c6d0]/50 font-body leading-relaxed">{a.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
