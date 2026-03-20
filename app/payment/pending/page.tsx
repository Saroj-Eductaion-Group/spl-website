'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function PendingContent() {
  const params = useSearchParams()
  const registrationId = params.get('registrationId') || ''
  const name = params.get('name') || ''
  const type = params.get('type') || 'individual'
  const amount = params.get('amount') || (type === 'team' ? '11000' : '1000')

  return (
    <div className="min-h-screen bg-[#0b0b0f] text-[#e4e1e9] flex items-center justify-center px-4 py-12 pt-24">
      <div className="max-w-lg w-full">

        {/* Header */}
        <div className="bg-[#ffd700] p-8 text-center">
          <span className="material-symbols-outlined text-[#002366] block mx-auto mb-4" style={{ fontSize: '64px' }}>schedule</span>
          <h1 className="font-headline font-black text-2xl italic uppercase tracking-tighter text-[#002366] mb-1">Registration Received</h1>
          <p className="text-[#002366]/70 text-sm font-body">Payment gateway not configured yet</p>
        </div>

        {/* Body */}
        <div className="bg-[#131318] border border-[#444650]/20 p-8 space-y-6">

          <div className="bg-[#ffd700]/5 border border-[#ffd700]/20 p-5 text-center">
            <p className="text-[0.6rem] font-headline font-bold uppercase tracking-widest text-[#c4c6d0]/60 mb-2">Registration ID</p>
            <p className="text-2xl font-headline font-black text-[#ffd700] tracking-widest">{registrationId}</p>
            <p className="text-xs text-[#c4c6d0]/50 mt-2">Save this ID for your records</p>
          </div>

          <div className="space-y-4 text-sm text-[#c4c6d0]">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-emerald-400 flex-shrink-0 mt-0.5" style={{ fontSize: '20px' }}>check_circle</span>
              <span>Your registration details have been saved successfully</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-[#ffd700] flex-shrink-0 mt-0.5" style={{ fontSize: '20px' }}>schedule</span>
              <span>
                Payment of <strong className="text-[#e4e1e9]">₹{Number(amount).toLocaleString('en-IN')}</strong> is pending.
                The payment gateway will be activated soon.
              </span>
            </div>
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-emerald-400 flex-shrink-0 mt-0.5" style={{ fontSize: '20px' }}>check_circle</span>
              <span>You will be notified via SMS & Email once payment link is available</span>
            </div>
          </div>

          <div className="bg-[#0b0b0f] border border-[#444650]/20 p-4 text-sm">
            <p className="font-headline font-bold uppercase tracking-tight text-[#c4c6d0] mb-3">Need help? Contact us:</p>
            <div className="space-y-2 text-[#c4c6d0]/70">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>mail</span> info@splcricket.com
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>phone</span> +91 XXXXX XXXXX
              </div>
            </div>
          </div>

          <Link href="/" className="block w-full text-center bg-[#ffd700] text-[#002366] py-3.5 font-headline font-black uppercase tracking-tight hover:brightness-110 transition-all">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function PaymentPendingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0b0b0f] flex items-center justify-center"><span className="w-8 h-8 border-2 border-[#444650] border-t-[#ffd700] rounded-full animate-spin" /></div>}>
      <PendingContent />
    </Suspense>
  )
}
