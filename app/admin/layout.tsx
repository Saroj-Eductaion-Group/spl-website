'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { LogOut, LayoutDashboard, Users, UserCheck, Calendar, Shield, Bell, FileText, Award, Menu, X, Send, MessageSquare, Image as GalleryIcon } from 'lucide-react'
import NextImage from 'next/image'

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/teams', label: 'Teams', icon: Users },
  { href: '/admin/players', label: 'Players', icon: UserCheck },
  { href: '/admin/fixtures', label: 'Fixtures', icon: Calendar },
  { href: '/admin/coordinators', label: 'Coordinators', icon: Shield },
  { href: '/admin/announcements', label: 'Announcements', icon: Bell },
  { href: '/admin/notifications', label: 'Notifications', icon: Send },
  { href: '/admin/gallery', label: 'Gallery', icon: GalleryIcon },
  { href: '/admin/messages', label: 'Messages', icon: MessageSquare },
  { href: '/admin/reports', label: 'Reports', icon: FileText },
  { href: '/admin/sponsors', label: 'Sponsors', icon: Award },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token && pathname !== '/admin/login') {
      router.push('/admin/login')
    } else if (token && pathname !== '/admin/login') {
      fetch('/api/admin/dashboard', { headers: { Authorization: `Bearer ${token}` } })
        .then(r => { if (r.status === 401) { localStorage.removeItem('adminToken'); router.push('/admin/login') } })
        .catch(() => {})
      setIsAuthenticated(true)
    } else {
      setIsAuthenticated(true)
    }
    setLoading(false)
  }, [pathname, router])

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    router.push('/admin/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (pathname === '/admin/login') return <>{children}</>
  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 shadow-lg z-30 flex flex-col transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:shadow-none`}>
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <NextImage src="/logo.png" alt="SPL" width={52} height={52} className="object-contain" />
            <div>
              <div className="text-sm font-bold text-primary-600">SPL Admin</div>
              <div className="text-xs text-gray-500">Tournament Panel</div>
            </div>
          </div>
          <button className="lg:hidden text-gray-400 hover:text-gray-600" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === item.href
                  ? 'bg-primary-50 text-primary-700 border border-primary-200'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar (mobile) */}
        <header className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-600 hover:text-gray-900">
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-semibold text-primary-600">SPL Admin</span>
        </header>

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
