'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { CheckCircle, Clock, XCircle, Users, User, Trophy, ArrowRight, Copy } from 'lucide-react'
import Link from 'next/link'

interface Registration {
  type: 'team' | 'individual'
  registrationId: string
  name: string
  district: string
  status?: string
  playerCount?: number
  payment?: { status: string; transactionId: string; amount: number } | null
  role?: string
  teamAssigned?: boolean
  assignedTeam?: { name: string; district: string } | null
  createdAt: string
}

const statusConfig: Record<string, { color: string; bg: string; icon: typeof CheckCircle; label: string }> = {
  APPROVED: { color: 'text-green-700', bg: 'bg-green-50 border-green-200', icon: CheckCircle, label: 'Approved' },
  PENDING:  { color: 'text-yellow-700', bg: 'bg-yellow-50 border-yellow-200', icon: Clock, label: 'Pending Review' },
  REJECTED: { color: 'text-red-700', bg: 'bg-red-50 border-red-200', icon: XCircle, label: 'Rejected' },
  COMPLETED:{ color: 'text-green-700', bg: 'bg-green-50 border-green-200', icon: CheckCircle, label: 'Completed' },
}

export default function MyRegistrationPage() {
  const { isLoaded, isSignedIn } = useUser()
  const router = useRouter()
  const [registration, setRegistration] = useState<Registration | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!isLoaded) return
    if (!isSignedIn) { router.push('/sign-in'); return }
    fetch('/api/my-registration')
      .then(r => r.json())
      .then(d => { setRegistration(d.registration); setLoading(false) })
      .catch(() => setLoading(false))
  }, [isLoaded, isSignedIn, router])

  const copyId = () => {
    if (!registration?.registrationId) return
    navigator.clipboard.writeText(registration.registrationId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="page-hero">
        <div className="container mx-auto px-4 text-center">
          <h1 className="page-hero-title">My Registration</h1>
          <p className="page-hero-sub">Track your SPL registration status</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-2xl">

        {!registration ? (
          <div className="card text-center py-12">
            <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No Registration Found</h2>
            <p className="text-gray-500 mb-8">You haven't registered for SPL yet. Join the tournament today!</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register?type=team" className="btn-primary flex items-center justify-center gap-2">
                <Users className="w-4 h-4" /> Register as Team
              </Link>
              <Link href="/register?type=individual" className="btn-gold flex items-center justify-center gap-2">
                <User className="w-4 h-4" /> Register as Individual
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">

            {/* Registration ID Card */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Registration Details</h2>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${registration.type === 'team' ? 'bg-primary-100 text-primary-700' : 'bg-gold-100 text-gold-700'}`}>
                  {registration.type === 'team' ? 'Team Registration' : 'Individual Registration'}
                </span>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Registration ID</p>
                  <p className="text-xl font-bold font-mono text-primary-700">{registration.registrationId}</p>
                </div>
                <button onClick={copyId} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-600 transition-colors">
                  <Copy className="w-4 h-4" />
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Name</p>
                  <p className="font-semibold text-gray-800">{registration.name}</p>
                </div>
                <div>
                  <p className="text-gray-500">District</p>
                  <p className="font-semibold text-gray-800">{registration.district}</p>
                </div>
                <div>
                  <p className="text-gray-500">Registered On</p>
                  <p className="font-semibold text-gray-800">{new Date(registration.createdAt).toLocaleDateString('en-IN')}</p>
                </div>
                {registration.type === 'team' && (
                  <div>
                    <p className="text-gray-500">Players</p>
                    <p className="font-semibold text-gray-800">{registration.playerCount} / 15</p>
                  </div>
                )}
                {registration.type === 'individual' && registration.role && (
                  <div>
                    <p className="text-gray-500">Playing Role</p>
                    <p className="font-semibold text-gray-800">{registration.role.replace('_', ' ')}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Status Card */}
            {registration.type === 'team' && registration.status && (() => {
              const cfg = statusConfig[registration.status] || statusConfig.PENDING
              const Icon = cfg.icon
              return (
                <div className={`card border ${cfg.bg}`}>
                  <div className="flex items-center gap-3">
                    <Icon className={`w-6 h-6 ${cfg.color}`} />
                    <div>
                      <p className="text-xs text-gray-500">Registration Status</p>
                      <p className={`font-bold text-lg ${cfg.color}`}>{cfg.label}</p>
                    </div>
                  </div>
                  {registration.status === 'PENDING' && (
                    <p className="text-sm text-gray-600 mt-3">Your registration is under review by the district coordinator. You will be notified via email/SMS once approved.</p>
                  )}
                  {registration.status === 'REJECTED' && (
                    <p className="text-sm text-red-600 mt-3">Your registration was rejected. Please contact us at info@splcricket.com for more information.</p>
                  )}
                </div>
              )
            })()}

            {/* Individual — Team Assignment Status */}
            {registration.type === 'individual' && (
              <div className={`card border ${registration.teamAssigned ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
                <div className="flex items-center gap-3">
                  {registration.teamAssigned
                    ? <CheckCircle className="w-6 h-6 text-green-600" />
                    : <Clock className="w-6 h-6 text-yellow-600" />
                  }
                  <div>
                    <p className="text-xs text-gray-500">Team Assignment</p>
                    <p className={`font-bold text-lg ${registration.teamAssigned ? 'text-green-700' : 'text-yellow-700'}`}>
                      {registration.teamAssigned ? 'Team Assigned' : 'Awaiting Assignment'}
                    </p>
                  </div>
                </div>
                {registration.teamAssigned && registration.assignedTeam && (
                  <div className="mt-3 bg-white rounded-lg p-3 text-sm">
                    <p className="text-gray-500">Assigned Team</p>
                    <p className="font-bold text-gray-800">{registration.assignedTeam.name}</p>
                    <p className="text-gray-500">{registration.assignedTeam.district}</p>
                  </div>
                )}
                {!registration.teamAssigned && (
                  <p className="text-sm text-gray-600 mt-3">The SPL district committee will assign you to a team based on your district and playing role. You will be notified once assigned.</p>
                )}
              </div>
            )}

            {/* Payment Status */}
            {registration.type === 'team' && (
              <div className="card">
                <h3 className="font-semibold text-gray-800 mb-3">Payment Status</h3>
                {registration.payment ? (() => {
                  const cfg = statusConfig[registration.payment.status] || statusConfig.PENDING
                  const Icon = cfg.icon
                  return (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className={`w-5 h-5 ${cfg.color}`} />
                        <span className={`font-semibold ${cfg.color}`}>{cfg.label}</span>
                      </div>
                      <span className="font-bold text-gray-800">₹{registration.payment.amount.toLocaleString('en-IN')}</span>
                    </div>
                  )
                })() : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-yellow-600" />
                      <span className="font-semibold text-yellow-700">Payment Pending</span>
                    </div>
                    <Link href="/register" className="text-sm text-primary-600 font-semibold flex items-center gap-1 hover:underline">
                      Complete Payment <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Contact */}
            <div className="bg-primary-50 border border-primary-100 rounded-xl p-4 text-sm text-center text-gray-600">
              Need help? Contact us at <a href="mailto:info@splcricket.com" className="text-primary-600 font-semibold">info@splcricket.com</a>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}
