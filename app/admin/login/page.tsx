'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    if (localStorage.getItem('adminToken')) router.replace('/admin/dashboard')
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      })
      const data = await res.json()
      if (res.ok) {
        localStorage.setItem('adminToken', data.token)
        router.push('/admin/dashboard')
      } else {
        setError(data.error || 'Login failed')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0b0b0f] flex -mt-20">

      {/* Left — Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col items-center justify-center p-16 bg-[#002366]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,215,0,0.15)_0%,transparent_60%)]" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#ffd700]/5 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#ffd700] via-[#ffe566] to-[#ffd700]" />

        <div className="relative z-10 text-center max-w-sm">
          <div className="w-20 h-20 bg-[#ffd700]/10 border border-[#ffd700]/20 flex items-center justify-center mx-auto mb-8">
            <span className="material-symbols-outlined text-[#ffd700]" style={{ fontSize: '40px' }}>admin_panel_settings</span>
          </div>
          <h1 className="font-headline font-black text-5xl italic uppercase tracking-tighter text-[#e4e1e9] mb-3">
            Admin <span className="text-[#ffd700]">Portal</span>
          </h1>
          <p className="text-[#c4c6d0] text-sm mb-12 font-body">SPL Tournament Management System</p>

          <div className="space-y-4 text-left">
            {[
              { icon: 'shield', text: 'Full tournament control & management' },
              { icon: 'emoji_events', text: 'Fixtures, results & team management' },
              { icon: 'description', text: 'Reports, exports & coordinator access' },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-4 bg-white/10 border border-[#ffd700]/20 px-4 py-3">
                <span className="material-symbols-outlined text-[#ffd700]" style={{ fontSize: '20px' }}>{icon}</span>
                <span className="text-white/80 text-sm font-body">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-6 py-12 bg-[#0b0b0f]">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-10">
            <span className="font-headline font-black text-3xl italic uppercase text-[#ffd700]">SPL Admin</span>
          </div>

          <div className="mb-8">
            <div className="w-12 h-12 bg-[#ffd700]/10 border border-[#ffd700]/20 flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-[#ffd700]" style={{ fontSize: '24px' }}>lock</span>
            </div>
            <h2 className="font-headline font-black text-4xl italic uppercase tracking-tighter text-[#e4e1e9]">Admin Login</h2>
            <p className="text-[#c4c6d0] text-sm mt-1 font-body">Saroj Premier League — HQ Access</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 text-sm mb-6 flex items-center gap-2 font-body">
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>error</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-headline font-bold uppercase tracking-widest text-[#c4c6d0] mb-2">
                Email Address
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#444650]" style={{ fontSize: '18px' }}>mail</span>
                <input
                  type="email" required
                  placeholder="admin@spl.com"
                  value={credentials.email}
                  onChange={e => setCredentials({ ...credentials, email: e.target.value })}
                  className="w-full bg-[#131318] border border-[#444650]/40 text-[#e4e1e9] pl-10 pr-4 py-3 text-sm font-body placeholder:text-[#444650] focus:outline-none focus:border-[#ffd700]/60 focus:bg-[#1c1c21] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-headline font-bold uppercase tracking-widest text-[#c4c6d0] mb-2">
                Password
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#444650]" style={{ fontSize: '18px' }}>lock</span>
                <input
                  type="password" required
                  placeholder="Enter your password"
                  value={credentials.password}
                  onChange={e => setCredentials({ ...credentials, password: e.target.value })}
                  className="w-full bg-[#131318] border border-[#444650]/40 text-[#e4e1e9] pl-10 pr-4 py-3 text-sm font-body placeholder:text-[#444650] focus:outline-none focus:border-[#ffd700]/60 focus:bg-[#1c1c21] transition-colors"
                />
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full bg-[#ffd700] text-[#002366] py-3.5 font-headline font-black uppercase tracking-tight text-sm hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2 justify-center">
                  <span className="w-4 h-4 border-2 border-[#002366]/30 border-t-[#002366] rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : 'Sign In to Admin Panel'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[#444650]/20 flex flex-col gap-3 text-center">
            <Link href="/coordinator/login" className="text-sm font-body text-[#c4c6d0]/60 hover:text-[#ffd700] transition-colors">
              District Coordinator? <span className="text-[#ffd700] font-semibold">Login here →</span>
            </Link>
            <Link href="/" className="text-xs font-body text-[#444650] hover:text-[#c4c6d0] transition-colors">
              ← Back to SPL Website
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
