'use client'

import { useSignIn } from '@clerk/nextjs'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ForgotPasswordPage() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()

  const [step, setStep] = useState<'email' | 'reset'>('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSendCode(e: React.FormEvent) {
    e.preventDefault()
    if (!isLoaded || !signIn) return
    setLoading(true)
    setError('')
    try {
      await signIn.create({ strategy: 'reset_password_email_code', identifier: email })
      setStep('reset')
    } catch (err: unknown) {
      setError((err as { errors?: { message: string }[] })?.errors?.[0]?.message || 'Email not found')
    } finally {
      setLoading(false)
    }
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    if (!isLoaded || !signIn) return
    setLoading(true)
    setError('')
    try {
      const result = await signIn.attemptFirstFactor({ strategy: 'reset_password_email_code', code, password })
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId })
        window.location.href = '/register'
      }
    } catch (err: unknown) {
      setError((err as { errors?: { message: string }[] })?.errors?.[0]?.message || 'Invalid code or password')
    } finally {
      setLoading(false)
    }
  }

  const inputCls = "w-full bg-[#131318] border border-[#444650]/40 text-[#e4e1e9] px-4 py-3 text-sm font-body placeholder:text-[#444650] focus:outline-none focus:border-[#ffd700]/60 focus:bg-[#1c1c21] transition-colors"
  const labelCls = "block text-xs font-headline font-bold uppercase tracking-widest text-[#c4c6d0] mb-2"

  return (
    <div className="min-h-screen -mt-20 flex items-center justify-center bg-[#0b0b0f] px-4">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#ffd700]/10 border border-[#ffd700]/20 flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-[#ffd700]" style={{ fontSize: '32px' }}>lock_reset</span>
          </div>
          <h1 className="font-headline font-black text-4xl italic uppercase tracking-tighter text-[#e4e1e9]">
            {step === 'email' ? 'Forgot Password' : 'Reset Password'}
          </h1>
          <p className="text-[#c4c6d0]/60 text-sm mt-2 font-body">
            {step === 'email' ? 'Enter your email to receive a reset code' : `Code sent to ${email}`}
          </p>
        </div>

        <div className="bg-[#131318] border border-[#444650]/20 p-8">
          {step === 'email' ? (
            <form onSubmit={handleSendCode} className="space-y-5">
              <div>
                <label className={labelCls}>Email Address</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#444650]" style={{ fontSize: '18px' }}>mail</span>
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
                    className={inputCls + ' pl-10'} />
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 text-sm flex items-center gap-2 font-body">
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>error</span>{error}
                </div>
              )}

              <button type="submit" disabled={loading}
                className="w-full bg-[#ffd700] text-[#002366] py-3.5 font-headline font-black uppercase tracking-tight text-sm hover:brightness-110 transition-all disabled:opacity-50">
                {loading ? (
                  <span className="flex items-center gap-2 justify-center">
                    <span className="w-4 h-4 border-2 border-[#002366]/30 border-t-[#002366] rounded-full animate-spin" />
                    Sending…
                  </span>
                ) : 'Send Reset Code'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleReset} className="space-y-5">
              <div>
                <label className={labelCls}>Verification Code</label>
                <input type="text" required maxLength={6} value={code}
                  onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  className={inputCls + ' text-center tracking-[0.5em] font-headline font-black text-lg'} />
              </div>
              <div>
                <label className={labelCls}>New Password</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#444650]" style={{ fontSize: '18px' }}>lock</span>
                  <input type={showPass ? 'text' : 'password'} required minLength={8} value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 8 characters"
                    className={inputCls + ' pl-10 pr-11'} />
                  <button type="button" onClick={() => setShowPass(v => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#444650] hover:text-[#ffd700] transition-colors">
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>{showPass ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 text-sm flex items-center gap-2 font-body">
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>error</span>{error}
                </div>
              )}

              <button type="submit" disabled={loading || code.length < 6}
                className="w-full bg-[#ffd700] text-[#002366] py-3.5 font-headline font-black uppercase tracking-tight text-sm hover:brightness-110 transition-all disabled:opacity-50">
                {loading ? (
                  <span className="flex items-center gap-2 justify-center">
                    <span className="w-4 h-4 border-2 border-[#002366]/30 border-t-[#002366] rounded-full animate-spin" />
                    Resetting…
                  </span>
                ) : 'Reset Password'}
              </button>
            </form>
          )}

          <p className="text-center text-sm text-[#c4c6d0]/60 mt-6 font-body">
            Remember it?{' '}
            <a href="/sign-in" className="text-[#ffd700] font-semibold hover:underline">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  )
}
