'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import TeamRegistrationForm from '@/components/TeamRegistrationForm'
import IndividualRegistrationForm from '@/components/IndividualRegistrationForm'

function RegisterInner() {
  const { isLoaded, isSignedIn } = useUser()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [registrationType, setRegistrationType] = useState<'team' | 'individual'>('team')
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const type = searchParams.get('type')
    if (type === 'individual') setRegistrationType('individual')
  }, [searchParams])

  useEffect(() => {
    if (!isLoaded) return
    if (!isSignedIn) { setChecking(false); return }
    fetch('/api/my-registration')
      .then(r => r.json())
      .then(d => {
        if (d.registration) router.replace('/my-registration')
        else setChecking(false)
      })
      .catch(() => setChecking(false))
  }, [isLoaded, isSignedIn, router])

  if (!isLoaded || checking) return (
    <div className="min-h-screen bg-[#0b0b0f] flex items-center justify-center">
      <span className="w-8 h-8 border-2 border-[#444650] border-t-[#ffd700] rounded-full animate-spin" />
    </div>
  )

  if (!isSignedIn) {
    router.push('/sign-in?redirect_url=/register')
    return (
      <div className="min-h-screen bg-[#0b0b0f] flex items-center justify-center">
        <span className="w-8 h-8 border-2 border-[#444650] border-t-[#ffd700] rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0b0b0f] text-[#e4e1e9] pt-20">

      {/* Hero */}
      <section className="spl-hero border-b border-[#ffd700]/15">
        <div className="max-w-screen-xl mx-auto relative z-10 text-center">
          <p className="text-[#ffd700] font-headline font-bold text-xs tracking-[0.3em] uppercase mb-4">Join SPL</p>
          <h1 className="font-headline font-black text-5xl md:text-6xl italic uppercase tracking-tighter leading-[0.9] mb-4 text-white">
            SPL <span className="text-[#ffd700]">Registration</span>
          </h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto">Register for Saroj Premier League Under-19 Cricket Tournament</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-12">

        {/* Type Selector */}
        <div className="grid md:grid-cols-2 gap-4 mb-10">
          <button onClick={() => setRegistrationType('team')}
            className={`p-6 border-2 text-left transition-all ${registrationType === 'team' ? 'border-[#ffd700] bg-[#ffd700]/5' : 'border-[#444650]/30 bg-[#131318] hover:border-[#ffd700]/40'}`}>
            <div className="flex items-center gap-3 mb-3">
              <span className={`material-symbols-outlined ${registrationType === 'team' ? 'text-[#ffd700]' : 'text-[#c4c6d0]/50'}`}>groups</span>
              <h3 className={`font-headline font-black uppercase tracking-tight ${registrationType === 'team' ? 'text-[#ffd700]' : 'text-[#e4e1e9]'}`}>Team Registration</h3>
            </div>
            <p className="text-[#c4c6d0] text-sm mb-3">Already have a team? Register with complete squad</p>
            <span className="text-[#ffd700] font-headline font-black text-sm">Fee: ₹11,000</span>
          </button>

          <button onClick={() => setRegistrationType('individual')}
            className={`p-6 border-2 text-left transition-all ${registrationType === 'individual' ? 'border-[#ffd700] bg-[#ffd700]/5' : 'border-[#444650]/30 bg-[#131318] hover:border-[#ffd700]/40'}`}>
            <div className="flex items-center gap-3 mb-3">
              <span className={`material-symbols-outlined ${registrationType === 'individual' ? 'text-[#ffd700]' : 'text-[#c4c6d0]/50'}`}>person</span>
              <h3 className={`font-headline font-black uppercase tracking-tight ${registrationType === 'individual' ? 'text-[#ffd700]' : 'text-[#e4e1e9]'}`}>Individual Registration</h3>
            </div>
            <p className="text-[#c4c6d0] text-sm mb-3">Don't have a team? We'll assign you to a district team</p>
            <span className="text-[#ffd700] font-headline font-black text-sm">Fee: ₹1,000</span>
          </button>
        </div>

        {registrationType === 'team' ? <TeamRegistrationForm /> : <IndividualRegistrationForm />}
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0b0b0f] flex items-center justify-center">
        <span className="w-8 h-8 border-2 border-[#444650] border-t-[#ffd700] rounded-full animate-spin" />
      </div>
    }>
      <RegisterInner />
    </Suspense>
  )
}
