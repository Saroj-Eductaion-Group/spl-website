'use client'

import Link from 'next/link'
import { CheckCircle, Copy } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'

export default function RegistrationSuccess() {
  const searchParams = useSearchParams()
  const registrationId = searchParams.get('registrationId') || ''
  const name = searchParams.get('name') || ''
  const type = searchParams.get('type') || 'team'
  const [copied, setCopied] = useState(false)

  const copyId = () => {
    navigator.clipboard.writeText(registrationId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-lg w-full">
        <div className="card text-center">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Registration Successful!</h1>
          <p className="text-gray-600 mb-8">
            {type === 'team'
              ? `Team "${name}" has been registered successfully.`
              : `${name} has been registered as an individual player.`}
            <br />A confirmation email has been sent to you.
          </p>

          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
            <p className="text-sm text-gray-500 mb-2">Your Registration ID</p>
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl font-bold text-green-700 tracking-widest">{registrationId}</span>
              <button onClick={copyId} className="text-green-600 hover:text-green-800" title="Copy">
                <Copy className="w-5 h-5" />
              </button>
            </div>
            {copied && <p className="text-xs text-green-600 mt-1">Copied!</p>}
            <p className="text-xs text-gray-500 mt-3">Save this ID — you will need it for future reference.</p>
          </div>

          {type === 'team' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-left">
              <p className="text-sm font-semibold text-yellow-800 mb-1">Next Steps:</p>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Payment of ₹11,000 is pending — admin will contact you</li>
                <li>• Your registration is under review</li>
                <li>• You will be notified on approval/rejection via email</li>
              </ul>
            </div>
          )}

          {type === 'individual' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
              <p className="text-sm font-semibold text-blue-800 mb-1">Next Steps:</p>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Your profile has been submitted to the district coordinator</li>
                <li>• You will be assigned to a district team</li>
                <li>• You will be notified once a team is assigned</li>
              </ul>
            </div>
          )}

          <Link href="/" className="btn-primary block text-center">Back to Home</Link>
        </div>
      </div>
    </div>
  )
}
