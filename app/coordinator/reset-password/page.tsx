'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

function ResetForm() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  useEffect(() => {
    if (!token) router.replace('/coordinator/forgot-password')
  }, [token, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) { setError('Passwords do not match'); return }
    if (password.length < 8) { setError('Password must be at least 8 characters'); return }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })
      const data = await res.json()
      if (res.ok) {
        setSuccess(true)
        setTimeout(() => router.push('/coordinator/login'), 3000)
      } else {
        setError(data.error || 'Reset failed')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0b0b0f] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">

        <div className="mb-8">
          <div className="w-12 h-12 bg-[#ffd700]/10 border border-[#ffd700]/20 flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-[#ffd700]" style={{ fontSize: '24px' }}>lock_reset</span>
          </div>
          <h2 className="font-headline font-black text-4xl italic uppercase tracking-tighter text-[#e4e1e9]">Reset Password</h2>
          <p className="text-[#c4c6d0] text-sm mt-1 font-body">Enter your new coordinator password</p>
        </div>

        {success ? (
          <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-5 py-4 text-sm font-body flex items-start gap-3">
            <span className="material-symbols-outlined mt-0.5" style={{ fontSize: '18px' }}>check_circle</span>
            <div>
              <p className="font-bold mb-1">Password reset successful!</p>
              <p className="text-green-400/80">Redirecting to login...</p>
            </div>
          </div>
        ) : (
          <>
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 text-sm mb-6 flex items-center gap-2 font-body">
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>error</span>
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-headline font-bold uppercase tracking-widest text-[#c4c6d0] mb-2">New Password</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#444650]" style={{ fontSize: '18px' }}>lock</span>
                  <input type={showPassword ? 'text' : 'password'} required placeholder="Min. 8 characters"
                    value={password} onChange={e => setPassword(e.target.value)}
                    className="w-full bg-[#131318] border border-[#444650]/40 text-[#e4e1e9] pl-10 pr-10 py-3 text-sm font-body placeholder:text-[#444650] focus:outline-none focus:border-[#ffd700]/60 focus:bg-[#1c1c21] transition-colors" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#444650] hover:text-[#c4c6d0] transition-colors">
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>{showPassword ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-headline font-bold uppercase tracking-widest text-[#c4c6d0] mb-2">Confirm Password</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#444650]" style={{ fontSize: '18px' }}>lock</span>
                  <input type={showPassword ? 'text' : 'password'} required placeholder="Re-enter password"
                    value={confirm} onChange={e => setConfirm(e.target.value)}
                    className="w-full bg-[#131318] border border-[#444650]/40 text-[#e4e1e9] pl-10 pr-4 py-3 text-sm font-body placeholder:text-[#444650] focus:outline-none focus:border-[#ffd700]/60 focus:bg-[#1c1c21] transition-colors" />
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-[#ffd700] text-[#002366] py-3.5 font-headline font-black uppercase tracking-tight text-sm hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? (
                  <span className="flex items-center gap-2 justify-center">
                    <span className="w-4 h-4 border-2 border-[#002366]/30 border-t-[#002366] rounded-full animate-spin" />
                    Resetting...
                  </span>
                ) : 'Reset Password'}
              </button>
            </form>
          </>
        )}

        <div className="mt-8 pt-6 border-t border-[#444650]/20 text-center">
          <Link href="/coordinator/login" className="text-sm font-body text-[#c4c6d0]/60 hover:text-[#ffd700] transition-colors">
            ← Back to Coordinator Login
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function ResetPassword() {
  return (
    <Suspense>
      <ResetForm />
    </Suspense>
  )
}
