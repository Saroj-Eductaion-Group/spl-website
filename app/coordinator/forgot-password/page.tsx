'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        setSent(true)
      } else {
        const data = await res.json()
        setError(data.error || 'Failed to send reset email. Please try again.')
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
          <h2 className="font-headline font-black text-4xl italic uppercase tracking-tighter text-[#e4e1e9]">Forgot Password</h2>
          <p className="text-[#c4c6d0] text-sm mt-1 font-body">Enter your coordinator email to receive a reset link</p>
        </div>

        {sent ? (
          <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-5 py-4 text-sm font-body flex items-start gap-3">
            <span className="material-symbols-outlined mt-0.5" style={{ fontSize: '18px' }}>mark_email_read</span>
            <div>
              <p className="font-bold mb-1">Reset link sent!</p>
              <p className="text-green-400/80">Check your email inbox. The link expires in 1 hour.</p>
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
                <label className="block text-xs font-headline font-bold uppercase tracking-widest text-[#c4c6d0] mb-2">Email Address</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#444650]" style={{ fontSize: '18px' }}>mail</span>
                  <input type="email" required placeholder="coordinator@spl.com"
                    value={email} onChange={e => setEmail(e.target.value)}
                    className="w-full bg-[#131318] border border-[#444650]/40 text-[#e4e1e9] pl-10 pr-4 py-3 text-sm font-body placeholder:text-[#444650] focus:outline-none focus:border-[#ffd700]/60 focus:bg-[#1c1c21] transition-colors" />
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-[#ffd700] text-[#002366] py-3.5 font-headline font-black uppercase tracking-tight text-sm hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? (
                  <span className="flex items-center gap-2 justify-center">
                    <span className="w-4 h-4 border-2 border-[#002366]/30 border-t-[#002366] rounded-full animate-spin" />
                    Sending...
                  </span>
                ) : 'Send Reset Link'}
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
