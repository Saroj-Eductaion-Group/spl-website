'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Clock, CheckCircle, Phone, Mail } from 'lucide-react'
import Link from 'next/link'

function PendingContent() {
  const params = useSearchParams()
  const registrationId = params.get('registrationId') || ''
  const name = params.get('name') || ''
  const type = params.get('type') || 'individual'
  const amount = params.get('amount') || (type === 'team' ? '11000' : '1000')

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full">

        {/* Header */}
        <div className="bg-yellow-500 rounded-t-2xl p-8 text-center text-white">
          <Clock className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-1">Registration Received</h1>
          <p className="text-yellow-100">Payment gateway not configured yet</p>
        </div>

        {/* Body */}
        <div className="bg-white rounded-b-2xl shadow-lg p-8 space-y-6">

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
            <p className="text-sm text-gray-600 mb-1">Registration ID</p>
            <p className="text-xl font-bold text-yellow-700 font-mono">{registrationId}</p>
            <p className="text-sm text-gray-500 mt-1">Save this ID for your records</p>
          </div>

          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Your registration details have been saved successfully</span>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
              <span>
                Payment of <strong>₹{Number(amount).toLocaleString('en-IN')}</strong> is pending.
                The payment gateway will be activated soon.
              </span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span>You will be notified via SMS & Email once payment link is available</span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 text-sm">
            <p className="font-semibold text-gray-700 mb-2">Need help? Contact us:</p>
            <div className="space-y-1 text-gray-600">
              <div className="flex items-center gap-2"><Mail className="w-4 h-4" /> info@splcricket.com</div>
              <div className="flex items-center gap-2"><Phone className="w-4 h-4" /> +91 XXXXX XXXXX</div>
            </div>
          </div>

          <Link href="/" className="block w-full text-center btn-primary py-3">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function PaymentPendingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" /></div>}>
      <PendingContent />
    </Suspense>
  )
}
