'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { CheckCircle, Copy, ArrowRight, Phone, Mail, Trophy, GraduationCap } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
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

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero confirmation bar */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 py-3 text-center">
        <p className="text-white text-sm font-semibold tracking-wide">
          🎉 Registration Confirmed — Welcome to Saroj Premier League U19!
        </p>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">

          {/* Main card */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8">

            {/* Top success banner */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 px-8 py-10 text-center">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-3xl font-extrabold text-white mb-2">Payment Successful!</h1>
              <p className="text-green-100 text-base">
                {isTeam
                  ? `Team "${name}" is now registered for SPL U19`
                  : `${name} is now registered as an individual player`}
              </p>
            </div>

            <div className="px-8 py-8 space-y-6">

              {/* Registration ID */}
              <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 text-center">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Your Registration ID</p>
                <div className="flex items-center justify-center gap-3 mb-2">
                  <span className="text-3xl font-extrabold text-green-700 tracking-widest font-mono">{registrationId}</span>
                  <button onClick={copyId} className="w-9 h-9 rounded-xl bg-green-100 hover:bg-green-200 flex items-center justify-center text-green-600 transition-colors" title="Copy ID">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                {copied && <p className="text-xs text-green-600 font-semibold">✓ Copied to clipboard</p>}
                {txnid && <p className="text-xs text-gray-400 mt-2">Transaction ID: {txnid}</p>}
                <p className="text-xs text-gray-500 mt-2 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2">
                  ⚠️ Save this ID — you will need it for all future correspondence
                </p>
              </div>

              {/* Next steps */}
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                <h3 className="font-bold text-blue-800 mb-4 flex items-center gap-2">
                  <ArrowRight className="w-4 h-4" /> What Happens Next
                </h3>
                <ol className="space-y-3">
                  {isTeam ? [
                    'A confirmation email has been sent to your registered email address',
                    'Your team documents will be reviewed by the District Coordinator',
                    'You will receive an approval or rejection notification via email & SMS',
                    'Approved teams will receive match schedule notifications',
                  ] : [
                    'A confirmation email has been sent to your registered email address',
                    'Your profile has been submitted to the District Coordinator',
                    'You will be assigned to a district-level team based on your role & availability',
                    'You will be notified via email & SMS once a team is assigned',
                  ].map((step, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-blue-700">
                      <span className="w-5 h-5 rounded-full bg-blue-200 text-blue-700 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              {/* Scholarship reminder */}
              <div className="bg-gradient-to-r from-primary-50 to-gold-50 border border-primary-200 rounded-2xl p-5 flex items-start gap-4">
                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="font-bold text-primary-700 text-sm">50% Scholarship Unlocked!</p>
                  <p className="text-primary-600 text-xs mt-1">
                    By participating in SPL U19, you are now eligible for a 50% scholarship at Saroj International University.
                    <Link href="/scholarships" className="underline ml-1 font-semibold">Learn more →</Link>
                  </p>
                </div>
              </div>

              {/* Prize reminder */}
              <div className="bg-gradient-to-r from-gold-50 to-yellow-50 border border-gold-200 rounded-2xl p-5 flex items-start gap-4">
                <div className="w-10 h-10 bg-gold-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Trophy className="w-5 h-5 text-gold-600" />
                </div>
                <div>
                  <p className="font-bold text-gold-700 text-sm">₹11,00,000 Winner Prize</p>
                  <p className="text-gold-600 text-xs mt-1">
                    Grand Final at Ekana Cricket Stadium, Lucknow. Give it your best shot!
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link href="/" className="flex-1 btn-primary text-center py-3.5">
                  Back to Home
                </Link>
                <Link href="/schedule" className="flex-1 text-center py-3.5 rounded-xl border-2 border-primary-200 text-primary-600 font-semibold hover:bg-primary-50 transition-colors">
                  View Schedule
                </Link>
              </div>

              {/* Support */}
              <div className="border-t border-gray-100 pt-5 flex flex-col sm:flex-row gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span>support@splcricket.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>+91 XXXXX XXXXX</span>
                </div>
              </div>
            </div>
          </div>

          {/* Logo */}
          <div className="text-center mb-8">
            <Image src="/Hero.png" alt="SPL" width={80} height={50} className="object-contain mx-auto opacity-60" />
            <p className="text-xs text-gray-400 mt-2">© 2025 Saroj Premier League. All rights reserved.</p>
          </div>
        </div>
      </div>

      <SponsorStrip />
    </div>
  )
}

export default function PaymentSuccess() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" /></div>}>
      <SuccessContent />
    </Suspense>
  )
}
