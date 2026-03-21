'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function SuccessInner() {
  const params = useSearchParams()
  const registrationId = params.get('registrationId') || ''
  const type = params.get('type') || 'team'

  return (
    <div className="min-h-screen bg-[#0b0b0f] text-[#e4e1e9] flex items-center justify-center px-6 pt-20">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center mx-auto mb-6">
          <span className="material-symbols-outlined text-emerald-400" style={{ fontSize: '40px' }}>check_circle</span>
        </div>
        <h1 className="font-headline font-black text-4xl italic uppercase tracking-tighter mb-2">
          Registration <span className="text-emerald-400">Successful!</span>
        </h1>
        <p className="text-[#c4c6d0] mb-8">
          {type === 'individual'
            ? 'You have been registered as an individual player. The SPL committee will assign you to a district team.'
            : 'Your team has been registered. A coordinator will review and approve your registration.'}
        </p>

        {registrationId && (
          <div className="bg-[#002366]/40 border border-[#ffd700]/30 p-6 mb-8">
            <p className="text-[0.6rem] font-headline font-bold uppercase tracking-widest text-[#c4c6d0]/60 mb-2">Your Registration ID</p>
            <p className="text-2xl font-headline font-black text-[#ffd700] tracking-wider">{registrationId}</p>
            <p className="text-xs text-[#c4c6d0]/50 mt-2">Save this ID for future reference</p>
          </div>
        )}

        <div className="space-y-3">
          <p className="text-sm text-[#c4c6d0]">A confirmation email has been sent to your registered email address.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
            <Link href="/my-registration"
              className="bg-[#ffd700] text-[#002366] px-6 py-3 font-headline font-black uppercase tracking-tight hover:brightness-110 transition-all">
              View My Registration
            </Link>
            <Link href="/"
              className="border border-[#444650]/40 text-[#c4c6d0] px-6 py-3 font-headline font-bold uppercase tracking-tight hover:border-[#ffd700] hover:text-[#ffd700] transition-all">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function RegisterSuccess() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0b0b0f] flex items-center justify-center">
        <span className="w-8 h-8 border-2 border-[#444650] border-t-[#ffd700] rounded-full animate-spin" />
      </div>
    }>
      <SuccessInner />
    </Suspense>
  )
}
