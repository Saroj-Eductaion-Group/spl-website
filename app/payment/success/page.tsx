'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import SponsorStrip from '@/components/SponsorStrip'

function SuccessContent() {
  const searchParams = useSearchParams()
  const registrationId = searchParams.get('registrationId') || ''
  const txnid = searchParams.get('txnid') || ''
  const name = searchParams.get('name') || ''
  const type = searchParams.get('type') || 'team'
  const [copied, setCopied] = useState(false)

  const copyId = () => {
    navigator.clipboard.writeText(registrationId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const isTeam = type === 'team'

  const nextSteps = isTeam ? [
    'A confirmation email has been sent to your registered email address',
    'Your team documents will be reviewed by the District Coordinator',
    'You will receive an approval or rejection notification via email & SMS',
    'Approved teams will receive match schedule notifications',
  ] : [
    'A confirmation email has been sent to your registered email address',
    'Your profile has been submitted to the District Coordinator',
    'You will be assigned to a district-level team based on your role & availability',
    'You will be notified via email & SMS once a team is assigned',
  ]

  return (
    <div className="min-h-screen bg-[#0b0b0f] text-[#e4e1e9] pt-20">

      {/* Top bar */}
      <div className="bg-emerald-600 py-3 text-center">
        <p className="text-white text-sm font-headline font-bold uppercase tracking-widest">
          🎉 Registration Confirmed — Welcome to Saroj Premier League U19!
        </p>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-12">

        {/* Success Card */}
        <div className="bg-[#131318] border border-[#444650]/20 overflow-hidden mb-6">

          {/* Top banner */}
          <div className="bg-emerald-600 px-8 py-10 text-center">
            <div className="w-20 h-20 bg-white/20 flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-white" style={{ fontSize: '48px' }}>check_circle</span>
            </div>
            <h1 className="font-headline font-black text-3xl italic uppercase tracking-tighter text-white mb-2">Payment Successful!</h1>
            <p className="text-emerald-100 text-sm">
              {isTeam ? `Team "${name}" is now registered for SPL U19` : `${name} is now registered as an individual player`}
            </p>
          </div>

          <div className="px-8 py-8 space-y-6">

            {/* Registration ID */}
            <div className="bg-emerald-400/5 border border-emerald-400/20 p-6 text-center">
              <p className="text-[0.6rem] font-headline font-bold uppercase tracking-widest text-[#c4c6d0]/60 mb-3">Your Registration ID</p>
              <div className="flex items-center justify-center gap-3 mb-2">
                <span className="text-3xl font-headline font-black text-emerald-400 tracking-widest">{registrationId}</span>
                <button onClick={copyId} className="w-9 h-9 bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center text-emerald-400 hover:bg-emerald-400/20 transition-colors" title="Copy ID">
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>content_copy</span>
                </button>
              </div>
              {copied && <p className="text-xs text-emerald-400 font-headline font-bold">✓ Copied to clipboard</p>}
              {txnid && <p className="text-xs text-[#c4c6d0]/50 mt-2">Transaction ID: {txnid}</p>}
              <p className="text-xs text-[#c4c6d0]/60 mt-3 bg-[#ffd700]/5 border border-[#ffd700]/20 px-3 py-2">
                ⚠️ Save this ID — you will need it for all future correspondence
              </p>
            </div>

            {/* Next Steps */}
            <div className="bg-[#002366]/30 border border-[#ffd700]/15 p-6">
              <h3 className="font-headline font-bold uppercase tracking-tight text-[#ffd700] mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span> What Happens Next
              </h3>
              <ol className="space-y-3">
                {nextSteps.map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-[#c4c6d0]">
                    <span className="w-5 h-5 bg-[#ffd700]/20 text-[#ffd700] font-headline font-black text-xs flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            {/* Scholarship */}
            <div className="bg-[#131318] border border-[#ffd700]/20 p-5 flex items-start gap-4">
              <div className="w-10 h-10 bg-[#ffd700]/10 border border-[#ffd700]/20 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[#ffd700]" style={{ fontSize: '20px' }}>school</span>
              </div>
              <div>
                <p className="font-headline font-black uppercase tracking-tight text-[#ffd700] text-sm">50% Scholarship Unlocked!</p>
                <p className="text-[#c4c6d0] text-xs mt-1">
                  By participating in SPL U19, you are now eligible for a 50% scholarship at Saroj International University.{' '}
                  <Link href="/scholarships" className="text-[#ffd700] underline font-semibold">Learn more →</Link>
                </p>
              </div>
            </div>

            {/* Prize */}
            <div className="bg-[#131318] border border-[#ffd700]/20 p-5 flex items-start gap-4">
              <div className="w-10 h-10 bg-[#ffd700]/10 border border-[#ffd700]/20 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[#ffd700]" style={{ fontSize: '20px' }}>emoji_events</span>
              </div>
              <div>
                <p className="font-headline font-black uppercase tracking-tight text-[#ffd700] text-sm">₹11,00,000 Winner Prize</p>
                <p className="text-[#c4c6d0] text-xs mt-1">Grand Final at Ekana Cricket Stadium, Lucknow. Give it your best shot!</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link href="/" className="flex-1 bg-[#ffd700] text-[#002366] py-3.5 font-headline font-black uppercase tracking-tight text-center hover:brightness-110 transition-all">
                Back to Home
              </Link>
              <Link href="/schedule" className="flex-1 text-center py-3.5 border-2 border-[#ffd700] text-[#ffd700] font-headline font-black uppercase tracking-tight hover:bg-[#ffd700] hover:text-[#002366] transition-all">
                View Schedule
              </Link>
            </div>

            {/* Support */}
            <div className="border-t border-[#444650]/20 pt-5 flex flex-col sm:flex-row gap-4 text-sm text-[#c4c6d0]/60">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>mail</span>
                <span>support@splcricket.com</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>phone</span>
                <span>+91 XXXXX XXXXX</span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-[#c4c6d0]/30 font-body">© 2025 Saroj Premier League. All rights reserved.</p>
      </div>

      <SponsorStrip />
    </div>
  )
}

export default function PaymentSuccess() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0b0b0f] flex items-center justify-center"><span className="w-8 h-8 border-2 border-[#444650] border-t-[#ffd700] rounded-full animate-spin" /></div>}>
      <SuccessContent />
    </Suspense>
  )
}
