'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { LogOut, LayoutDashboard, Users, UserCheck, Calendar, Shield, Bell, FileText } from 'lucide-react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token && pathname !== '/admin/login') {
      router.push('/admin/login')
    } else if (token && pathname !== '/admin/login') {
      // Verify token is still valid
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (!isAuthenticated && pathname !== '/admin/login') {
    return null
  }

  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/teams', label: 'Teams', icon: Users },
    { href: '/admin/players', label: 'Players', icon: UserCheck },
    { href: '/admin/fixtures', label: 'Fixtures', icon: Calendar },
    { href: '/admin/coordinators', label: 'Coordinators', icon: Shield },
    { href: '/admin/announcements', label: 'Announcements', icon: Bell },
    { href: '/admin/reports', label: 'Reports', icon: FileText }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-bold text-primary-600">SPL Admin</h1>
              <div className="flex space-x-4">
                {navItems.map(item => (
                  <a
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                      pathname === item.href
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </a>
                ))}
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  )
}
