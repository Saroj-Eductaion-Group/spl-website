'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

const navItems = [
  { href: '/admin/dashboard',     icon: 'dashboard',            label: 'Dashboard'     },
  { href: '/admin/teams',         icon: 'groups',               label: 'Teams'         },
  { href: '/admin/players',       icon: 'person_check',         label: 'Players'       },
  { href: '/admin/fixtures',      icon: 'calendar_month',       label: 'Fixtures'      },
  { href: '/admin/coordinators',  icon: 'shield_person',        label: 'Coordinators'  },
  { href: '/admin/announcements', icon: 'campaign',             label: 'Announcements' },
  { href: '/admin/notifications', icon: 'send',                 label: 'Notifications' },
  { href: '/admin/gallery',       icon: 'photo_library',        label: 'Gallery'       },
  { href: '/admin/messages',      icon: 'forum',                label: 'Messages'      },
  { href: '/admin/reports',       icon: 'bar_chart',            label: 'Reports'       },
  { href: '/admin/sponsors',      icon: 'handshake',            label: 'Sponsors'      },
  { href: '/admin/player-of-week', icon: 'emoji_events',         label: 'Player of Week'},
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (pathname === '/admin/login') {
      setLoading(false)
      return
    }
    if (!token) {
      router.replace('/admin/login')
      // don't setLoading(false) — keep spinner until redirect completes
      return
    }
    // Validate token with server
    fetch('/api/admin/dashboard', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => {
        if (r.status === 401) {
          localStorage.removeItem('adminToken')
          router.replace('/admin/login')
        } else {
          setIsAuthenticated(true)
          setLoading(false)
        }
      })
      .catch(() => {
        // network error — still allow if token exists
        setIsAuthenticated(true)
        setLoading(false)
      })
  }, [pathname, router])

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    router.push('/admin/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0b0f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="w-10 h-10 border-2 border-[#444650] border-t-[#ffd700] rounded-full animate-spin" />
          <span className="text-[#c4c6d0] text-xs font-headline font-bold uppercase tracking-widest">Loading...</span>
        </div>
      </div>
    )
  }

  if (pathname === '/admin/login') return <>{children}</>
  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen bg-[#0b0b0f] flex font-body">

      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/70 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-60 bg-[#002366] border-r border-[#ffd700]/15 z-30 flex flex-col transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static`}>

        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-[#ffd700]/15">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#ffd700] flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[#002366]" style={{ fontSize: '16px' }}>admin_panel_settings</span>
            </div>
            <div>
              <div className="text-sm font-headline font-black uppercase tracking-tight text-[#ffd700]">SPL Admin</div>
              <div className="text-[10px] text-white/40 font-body uppercase tracking-widest">HQ Panel</div>
            </div>
          </Link>
          <button className="lg:hidden text-[#c4c6d0]/40 hover:text-[#ffd700] transition-colors" onClick={() => setSidebarOpen(false)}>
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>close</span>
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map(item => {
            const active = pathname === item.href
            return (
              <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm font-headline font-bold uppercase tracking-wide transition-colors
                  ${active
                    ? 'bg-[#ffd700] text-[#002366] border-l-2 border-[#ffd700]'
                    : 'text-white/60 hover:text-white hover:bg-white/10 border-l-2 border-transparent'
                  }`}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-4 border-t border-[#ffd700]/15 space-y-1">
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 text-sm font-headline font-bold uppercase tracking-wide text-white/40 hover:text-white hover:bg-white/10 transition-colors border-l-2 border-transparent">
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>public</span>
            View Site
          </Link>
          <button onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-headline font-bold uppercase tracking-wide text-red-300/70 hover:text-red-300 hover:bg-red-500/10 transition-colors border-l-2 border-transparent">
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>logout</span>
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Topbar */}
        <header className="bg-[#002366] border-b border-[#ffd700]/15 px-5 py-3.5 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-[#c4c6d0]/60 hover:text-[#ffd700] transition-colors">
              <span className="material-symbols-outlined">menu</span>
            </button>
            <span className="text-xs font-headline font-bold uppercase tracking-widest text-[#c4c6d0]/40">
              {navItems.find(n => n.href === pathname)?.label || 'Admin'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:flex items-center gap-1.5 text-xs font-headline font-bold uppercase tracking-widest text-[#ffd700]/60">
              <span className="w-1.5 h-1.5 bg-[#ffd700] rounded-full animate-pulse" />
              SPL HQ
            </span>
            <button onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs font-headline font-bold uppercase tracking-wide text-[#c4c6d0]/40 hover:text-red-400 transition-colors">
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>logout</span>
              <span className="hidden sm:block">Logout</span>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6 text-[#e4e1e9]">
          {children}
        </main>
      </div>
    </div>
  )
}
