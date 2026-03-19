'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Mail, Shield, Users, ClipboardList, CheckCircle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const leftPanelStyle = { background: 'linear-gradient(135deg, #1e3270 0%, #1d4ed8 60%, #1e3270 100%)' }
const overlayStyle = { backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(218,167,55,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(218,167,55,0.1) 0%, transparent 50%)' }
const iconBgStyle = { background: 'rgba(218,167,55,0.2)' }

export default function CoordinatorLogin() {
  const [credentials, setCredentials] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/coordinator-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      })
      const data = await res.json()
      if (res.ok) {
        localStorage.setItem('coordinatorToken', data.token)
        localStorage.setItem('coordinatorDistrict', data.user?.district || '')
        router.push('/coordinator/dashboard')
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
    <div className="min-h-screen -mt-20 flex">

      {/* Left — Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col items-center justify-center p-12" style={leftPanelStyle}>
        <div className="absolute inset-0" style={overlayStyle} />
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full -translate-y-1/2 translate-x-1/2" style={{ background: 'rgba(218,167,55,0.08)' }} />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full translate-y-1/2 -translate-x-1/2" style={{ background: 'rgba(218,167,55,0.06)' }} />

        <div className="relative z-10 text-center">
          <Image src="/Hero.png" alt="SPL Logo" width={180} height={100} className="object-contain mx-auto mb-8" />
          <h1 className="text-4xl font-extrabold text-white mb-3">Coordinator Portal</h1>
          <p className="text-blue-200 text-lg mb-12">District Coordinator Access — SPL U19</p>

          <div className="space-y-5 text-left max-w-xs mx-auto">
            {[
              { icon: Users, text: 'View & manage district teams' },
              { icon: ClipboardList, text: 'Verify documents & approve registrations' },
              { icon: CheckCircle, text: 'Upload match results & assign players' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={iconBgStyle}>
                  <Icon className="w-5 h-5 text-yellow-400" />
                </div>
                <span className="text-blue-100 text-sm font-medium">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center bg-gray-50 px-6 py-12">
        <div className="w-full max-w-md">

          <div className="lg:hidden text-center mb-8">
            <Image src="/Hero.png" alt="SPL" width={120} height={70} className="object-contain mx-auto mb-3" />
          </div>

          <div className="mb-8">
            <div className="w-14 h-14 bg-gold-500 rounded-2xl flex items-center justify-center mb-5 shadow-lg">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900">Coordinator Login</h2>
            <p className="text-gray-500 mt-1">District Coordinator Access Portal</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-6 flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center text-xs flex-shrink-0">!</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="form-label">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="email" required className="form-input pl-10" placeholder="coordinator@spl.com"
                  value={credentials.email} onChange={e => setCredentials({ ...credentials, email: e.target.value })} />
              </div>
            </div>

            <div>
              <label className="form-label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="password" required className="form-input pl-10" placeholder="Enter your password"
                  value={credentials.password} onChange={e => setCredentials({ ...credentials, password: e.target.value })} />
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full btn-gold py-3.5 text-base disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0">
              {loading ? (
                <span className="flex items-center gap-2 justify-center">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : 'Sign In to Coordinator Panel'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <Link href="/admin/login" className="text-sm text-gray-500 hover:text-primary-600 transition-colors">
              Admin? <span className="font-semibold text-primary-600">Login here →</span>
            </Link>
          </div>
          <div className="mt-4 text-center">
            <Link href="/" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">← Back to SPL Website</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
