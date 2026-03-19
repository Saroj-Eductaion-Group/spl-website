'use client'

import { useSignIn } from '@clerk/nextjs'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Eye, EyeOff } from 'lucide-react'
import Image from 'next/image'

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
    if (!isLoaded) return
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
    if (!isLoaded) return
    setLoading(true)
    setError('')
    try {
      const result = await signIn.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code,
        password,
      })
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId })
        router.push('/register')
      }
    } catch (err: unknown) {
      setError((err as { errors?: { message: string }[] })?.errors?.[0]?.message || 'Invalid code or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen -mt-20 flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <Image src="/Hero.png" alt="SPL" width={80} height={50} className="object-contain mx-auto mb-4" />
          <h1 className="text-2xl font-extrabold text-gray-900">
            {step === 'email' ? 'Forgot Password' : 'Reset Password'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {step === 'email'
              ? 'Enter your email to receive a reset code'
              : `Code sent to ${email}`}
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200 p-8">
          {step === 'email' ? (
            <form onSubmit={handleSendCode} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 text-gray-900 placeholder-gray-400 text-sm outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">{error}</div>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-70 disabled:translate-y-0"
                style={{ background: 'linear-gradient(135deg, #1d4ed8, #1e3270)' }}
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? 'Sending…' : 'Send Reset Code'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleReset} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Verification code</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={code}
                  onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 text-gray-900 text-sm outline-none focus:border-blue-500 transition-colors text-center tracking-[0.5em] font-bold text-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">New password</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    required
                    minLength={8}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Min. 8 characters"
                    className="w-full px-4 py-3 pr-11 rounded-2xl border-2 border-gray-200 text-gray-900 placeholder-gray-400 text-sm outline-none focus:border-blue-500 transition-colors"
                  />
                  <button type="button" onClick={() => setShowPass(v => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">{error}</div>}

              <button
                type="submit"
                disabled={loading || code.length < 6}
                className="w-full py-3.5 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-70 disabled:translate-y-0"
                style={{ background: 'linear-gradient(135deg, #1d4ed8, #1e3270)' }}
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? 'Resetting…' : 'Reset Password'}
              </button>
            </form>
          )}

          <p className="text-center text-sm text-gray-500 mt-6">
            Remember it?{' '}
            <a href="/sign-in" className="text-blue-600 hover:text-blue-700 font-semibold">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  )
}
