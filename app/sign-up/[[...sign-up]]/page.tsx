'use client'

import { useSignUp } from '@clerk/nextjs'
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

export default function SignUpPage() {
  const { signUp, setActive, isLoaded } = useSignUp()
  const router = useRouter()

  const [step, setStep] = useState<'form' | 'verify'>('form')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    if (!isLoaded) return
    setLoading(true)
    setError('')
    try {
      await signUp.create({
        firstName: name.split(' ')[0],
        lastName: name.split(' ').slice(1).join(' ') || undefined,
        emailAddress: email,
        password,
      })
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
      setStep('verify')
    } catch (err: unknown) {
      setError(
        (err as { errors?: { message: string }[] })?.errors?.[0]?.message || 'Something went wrong'
      )
    } finally {
      setLoading(false)
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault()
    if (!isLoaded) return
    setLoading(true)
    setError('')
    try {
      const result = await signUp.attemptEmailAddressVerification({ code })
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId })
        router.push('/register')
      }
    } catch (err: unknown) {
      setError(
        (err as { errors?: { message: string }[] })?.errors?.[0]?.message || 'Invalid code'
      )
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
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full -translate-y-1/2 translate-x-1/2"
          style={{ background: 'rgba(218,167,55,0.08)' }} />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full translate-y-1/2 -translate-x-1/2"
          style={{ background: 'rgba(218,167,55,0.06)' }} />

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

          <div className="bg-white rounded-3xl shadow-xl shadow-gray-200 p-8 lg:p-10">

            {step === 'form' ? (
              <>
                <div className="mb-8">
                  <h2 className="text-2xl font-extrabold text-gray-900">Create account</h2>
                  <p className="text-gray-500 text-sm mt-1">Register to participate in SPL U19</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-5">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Rahul Sharma"
                      className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 text-gray-900 placeholder-gray-400 text-sm outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>

                  {/* Email */}
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

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
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
                      <button
                        type="button"
                        onClick={() => setShowPass(v => !v)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:translate-y-0"
                    style={{ background: 'linear-gradient(135deg, #1d4ed8, #1e3270)' }}
                  >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {loading ? 'Creating account…' : 'Create account'}
                  </button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-6">
                  Already have an account?{' '}
                  <a href="/sign-in" className="text-blue-600 hover:text-blue-700 font-semibold">Sign in</a>
                </p>
              </>
            ) : (
              <>
                <div className="mb-8">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                    style={{ background: 'rgba(29,78,216,0.1)' }}>
                    <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-extrabold text-gray-900">Verify your email</h2>
                  <p className="text-gray-500 text-sm mt-1">
                    We sent a 6-digit code to <span className="font-semibold text-gray-700">{email}</span>
                  </p>
                </div>

                <form onSubmit={handleVerify} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Verification code</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={code}
                      onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="000000"
                      className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 text-gray-900 placeholder-gray-400 text-sm outline-none focus:border-blue-500 transition-colors text-center tracking-[0.5em] font-bold text-lg"
                    />
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading || code.length < 6}
                    className="w-full py-3.5 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:translate-y-0"
                    style={{ background: 'linear-gradient(135deg, #1d4ed8, #1e3270)' }}
                  >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {loading ? 'Verifying…' : 'Verify & continue'}
                  </button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-6">
                  Wrong email?{' '}
                  <button onClick={() => { setStep('form'); setError('') }}
                    className="text-blue-600 hover:text-blue-700 font-semibold">
                    Go back
                  </button>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
