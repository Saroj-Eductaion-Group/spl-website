'use client'

import { useSignIn } from '@clerk/nextjs'
import Image from 'next/image'
import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function SignInForm() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const searchParams = useSearchParams()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isLoaded || !signIn) {
      setError('Auth not ready, please wait a moment and try again.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const result = await signIn.create({ identifier: email, password })
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId })
        const redirect = searchParams.get('redirect_url') || '/register'
        window.location.href = redirect
      } else {
        setError('Sign in incomplete. Please try again.')
      }
    } catch (err: unknown) {
      const msg = (err as { errors?: { code?: string; message: string; longMessage?: string }[] })?.errors?.[0]
      if (msg?.code === 'strategy_for_user_invalid') {
        setError('This account was created with Google. Please use "Continue with Google" below.')
      } else {
        setError(msg?.longMessage || msg?.message || 'Invalid email or password')
      }
    } finally {
      setLoading(false)
    }
  }

  const inputCls = "w-full bg-[#131318] border border-[#444650]/40 text-[#e4e1e9] px-4 py-3 text-sm font-body placeholder:text-[#444650] focus:outline-none focus:border-[#ffd700]/60 focus:bg-[#1c1c21] transition-colors"
  const labelCls = "block text-xs font-headline font-bold uppercase tracking-widest text-[#c4c6d0] mb-2"

  return (
    <div className="min-h-screen -mt-20 flex bg-[#0b0b0f]">

      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col items-center justify-center p-12 bg-[#002366]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,215,0,0.15)_0%,transparent_60%)]" />
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#ffd700] via-[#ffe566] to-[#ffd700]" />
        <div className="relative z-10 text-center">
          <Image src="/Hero.png" alt="SPL Logo" width={180} height={100} className="object-contain mx-auto mb-8" sizes="180px" />
          <h1 className="font-headline font-black text-4xl italic uppercase tracking-tighter text-white mb-3">Saroj Premier League</h1>
          <p className="text-white/60 text-lg mb-12 font-body">Under-19 Cricket Tournament — Uttar Pradesh</p>
          <div className="space-y-4 text-left max-w-xs mx-auto">
            {[
              { icon: 'emoji_events',   text: '₹11,00,000 Winner Prize Money' },
              { icon: 'school',         text: '50% Scholarship at Saroj International University' },
              { icon: 'sports_cricket', text: 'Grand Final at Ekana Cricket Stadium' },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-3 bg-white/10 border border-[#ffd700]/20 px-4 py-3">
                <span className="material-symbols-outlined text-[#ffd700]" style={{ fontSize: '20px' }}>{icon}</span>
                <span className="text-white/80 text-sm font-body">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-6 py-12 bg-[#0b0b0f]">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-10">
            <Image src="/Hero.png" alt="SPL" width={100} height={60} className="object-contain mx-auto mb-3" sizes="100px" />
            <h2 className="font-headline font-black text-xl italic uppercase text-[#ffd700]">Saroj Premier League</h2>
            <p className="text-[#c4c6d0]/60 text-sm">Under-19 Cricket Tournament</p>
          </div>

          <div className="mb-8">
            <div className="w-12 h-12 bg-[#ffd700]/10 border border-[#ffd700]/20 flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-[#ffd700]" style={{ fontSize: '24px' }}>login</span>
            </div>
            <h2 className="font-headline font-black text-4xl italic uppercase tracking-tighter text-[#e4e1e9]">Welcome Back</h2>
            <p className="text-[#c4c6d0]/60 text-sm mt-1 font-body">Sign in to register for the tournament</p>
          </div>

          {!isLoaded && (
            <div className="flex items-center gap-2 text-[#c4c6d0]/50 text-sm mb-4 font-body">
              <span className="w-4 h-4 border-2 border-[#444650] border-t-[#ffd700] rounded-full animate-spin" />
              Loading...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className={labelCls}>Email Address</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#444650]" style={{ fontSize: '18px' }}>mail</span>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
                  className={inputCls + ' pl-10'} />
              </div>
            </div>
            <div>
              <label className={labelCls}>Password</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#444650]" style={{ fontSize: '18px' }}>lock</span>
                <input type={showPass ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password"
                  className={inputCls + ' pl-10 pr-11'} />
                <button type="button" onClick={() => setShowPass(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#444650] hover:text-[#ffd700] transition-colors">
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>{showPass ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>
            <div className="flex justify-end -mt-1">
              <a href="/forgot-password" className="text-xs text-[#ffd700]/70 hover:text-[#ffd700] font-headline font-bold uppercase tracking-widest transition-colors">
                Forgot password?
              </a>
            </div>
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 text-sm flex items-center gap-2 font-body">
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>error</span>{error}
              </div>
            )}
            <button type="submit" disabled={loading || !isLoaded}
              className="w-full bg-[#ffd700] text-[#002366] py-3.5 font-headline font-black uppercase tracking-tight text-sm hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? (
                <span className="flex items-center gap-2 justify-center">
                  <span className="w-4 h-4 border-2 border-[#002366]/30 border-t-[#002366] rounded-full animate-spin" />
                  Signing in…
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-[#444650]/30" />
            <span className="text-xs font-headline font-bold uppercase tracking-widest text-[#444650]">or</span>
            <div className="flex-1 h-px bg-[#444650]/30" />
          </div>

          <button
            onClick={() => signIn?.authenticateWithRedirect({ strategy: 'oauth_google', redirectUrl: '/sso-callback', redirectUrlComplete: searchParams.get('redirect_url') || '/register' })}
            disabled={!isLoaded}
            className="w-full flex items-center justify-center gap-3 bg-[#131318] border border-[#444650]/40 text-[#e4e1e9] py-3.5 font-headline font-bold uppercase tracking-tight text-sm hover:border-[#ffd700]/40 hover:bg-[#1c1c21] transition-all disabled:opacity-50">
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <p className="text-center text-sm text-[#c4c6d0]/60 mt-6 font-body">
            Don&apos;t have an account?{' '}
            <a href="/sign-up" className="text-[#ffd700] font-semibold hover:underline">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0b0b0f] flex items-center justify-center">
        <span className="w-10 h-10 border-2 border-[#444650] border-t-[#ffd700] rounded-full animate-spin" />
      </div>
    }>
      <SignInForm />
    </Suspense>
  )
}
