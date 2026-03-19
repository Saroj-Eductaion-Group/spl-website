'use client'

import { useSignIn } from '@clerk/nextjs'
import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trophy, GraduationCap, Star, Eye, EyeOff, Loader2 } from 'lucide-react'

const leftPanelStyle = {
  background: 'linear-gradient(135deg, #1e3270 0%, #1d4ed8 60%, #1e3270 100%)',
}
const overlayStyle = {
  backgroundImage:
    'radial-gradient(circle at 20% 50%, rgba(218,167,55,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(218,167,55,0.1) 0%, transparent 50%)',
}
const iconBgStyle = { background: 'rgba(218,167,55,0.2)' }

export default function SignInPage() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isLoaded) return
    setLoading(true)
    setError('')
    try {
      const result = await signIn.create({ identifier: email, password })
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId })
        window.location.href = '/register'
      }
    } catch (err: unknown) {
      const msg =
        (err as { errors?: { message: string }[] })?.errors?.[0]?.message ||
        'Invalid email or password'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen -mt-20 flex">

      {/* Left Panel */}
      <div
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col items-center justify-center p-12"
        style={leftPanelStyle}
      >
        <div className="absolute inset-0" style={overlayStyle} />
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full -translate-y-1/2 translate-x-1/2"
          style={{ background: 'rgba(218,167,55,0.08)' }}
        />
        <div
          className="absolute bottom-0 left-0 w-64 h-64 rounded-full translate-y-1/2 -translate-x-1/2"
          style={{ background: 'rgba(218,167,55,0.06)' }}
        />

        <div className="relative z-10 text-center">
          <Image src="/Hero.png" alt="SPL Logo" width={180} height={100} className="object-contain mx-auto mb-8" />
          <h1 className="text-4xl font-extrabold text-white mb-3">Saroj Premier League</h1>
          <p className="text-blue-200 text-lg mb-12">Under-19 Cricket Tournament — Uttar Pradesh</p>

          <div className="space-y-5 text-left max-w-xs mx-auto">
            {[
              { icon: Trophy, text: '₹11,00,000 Winner Prize Money' },
              { icon: GraduationCap, text: '50% Scholarship at Saroj International University' },
              { icon: Star, text: 'Grand Final at Ekana Cricket Stadium' },
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

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center bg-gray-50 px-6 py-12">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <Image src="/Hero.png" alt="SPL" width={100} height={60} className="object-contain mx-auto mb-3" />
            <h2 className="text-xl font-bold text-gray-900">Saroj Premier League</h2>
            <p className="text-gray-500 text-sm">Under-19 Cricket Tournament</p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-3xl shadow-xl shadow-gray-200 p-8 lg:p-10">
            <div className="mb-8">
              <h2 className="text-2xl font-extrabold text-gray-900">Welcome back</h2>
              <p className="text-gray-500 text-sm mt-1">Sign in to register for the tournament</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Email address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 text-gray-900 placeholder-gray-400 text-sm outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 pr-11 rounded-2xl border-2 border-gray-200 text-gray-900 placeholder-gray-400 text-sm outline-none focus:border-blue-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(v => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Forgot password */}
              <div className="flex justify-end -mt-1">
                <a href="/forgot-password" className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                  Forgot password?
                </a>
              </div>

              {/* Error */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:translate-y-0"
                style={{ background: 'linear-gradient(135deg, #1d4ed8, #1e3270)' }}
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? 'Signing in…' : 'Sign in'}
              </button>
            </form>

            {/* Footer */}
            <p className="text-center text-sm text-gray-500 mt-6">
              Don&apos;t have an account?{' '}
              <a href="/sign-up" className="text-blue-600 hover:text-blue-700 font-semibold">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
