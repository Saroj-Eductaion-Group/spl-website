'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Registration {
  type: 'team' | 'individual'
  registrationId: string
  name: string
  district: string
  status?: string
  playerCount?: number
  players?: { id: string; name: string; role: string; phone: string; district: string; schoolCollege: string; isIndividual: boolean }[]
  payment?: { status: string; transactionId: string; amount: number } | null
  role?: string
  teamAssigned?: boolean
  assignedTeam?: {
    name: string
    district: string
    schoolCollege: string
    managerName: string | null
    managerPhone: string | null
    coachName: string | null
    coachPhone: string | null
    contactEmail: string | null
    registrationId: string
  } | null
  createdAt: string
}

const statusMap: Record<string, { icon: string; color: string; bg: string; label: string }> = {
  APPROVED:  { icon: 'check_circle',  color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/30', label: 'Approved'      },
  PENDING:   { icon: 'schedule',      color: 'text-[#ffd700]',   bg: 'bg-[#ffd700]/10 border-[#ffd700]/30',     label: 'Pending Review'},
  REJECTED:  { icon: 'cancel',        color: 'text-red-400',     bg: 'bg-red-400/10 border-red-400/30',         label: 'Rejected'      },
  COMPLETED: { icon: 'verified',      color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/30', label: 'Completed'     },
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

  if (!isLoaded || loading) return (
    <div className="min-h-screen bg-[#0b0b0f] flex items-center justify-center">
      <span className="w-8 h-8 border-2 border-[#444650] border-t-[#ffd700] rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0b0b0f] text-[#e4e1e9] pt-20">

      {/* Hero */}
      <section className="spl-hero border-b border-[#ffd700]/15">
        <div className="max-w-screen-xl mx-auto relative z-10 text-center">
          <p className="text-[#ffd700] font-headline font-bold text-xs tracking-[0.3em] uppercase mb-4">Dashboard</p>
          <h1 className="font-headline font-black text-5xl md:text-6xl italic uppercase tracking-tighter leading-[0.9] mb-4 text-white">
            My <span className="text-[#ffd700]">Registration</span>
          </h1>
          <p className="text-white/70 text-lg">Track your SPL registration status</p>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-6 py-12">

        {!registration ? (
          <div className="bg-[#131318] border border-[#444650]/20 p-12 text-center">
            <span className="material-symbols-outlined text-[#ffd700]/20 mb-4 block" style={{ fontSize: '64px' }}>emoji_events</span>
            <h2 className="font-headline font-black text-2xl uppercase tracking-tight mb-2">No Registration Found</h2>
            <p className="text-[#c4c6d0] mb-8">You haven't registered for SPL yet. Join the tournament today!</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register?type=team" className="bg-[#ffd700] text-[#002366] px-6 py-3 font-headline font-black uppercase tracking-tight hover:brightness-110 transition-all">
                Register as Team
              </Link>
              <Link href="/register?type=individual" className="border-2 border-[#ffd700] text-[#ffd700] px-6 py-3 font-headline font-black uppercase tracking-tight hover:bg-[#ffd700] hover:text-[#002366] transition-all">
                Register as Individual
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">

            {/* Registration ID */}
            <div className="bg-[#131318] border border-[#444650]/20 p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-headline font-black uppercase tracking-tight text-[#e4e1e9]">Registration Details</h2>
                <span className={`text-[0.6rem] font-headline font-black uppercase tracking-widest px-3 py-1 border ${registration.type === 'team' ? 'text-[#ffd700] border-[#ffd700]/30 bg-[#ffd700]/10' : 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10'}`}>
                  {registration.type === 'team' ? 'Team' : 'Individual'}
                </span>
              </div>

              <div className="bg-[#002366]/40 border border-[#ffd700]/20 p-4 flex items-center justify-between mb-5">
                <div>
                  <p className="text-[0.6rem] font-headline font-bold uppercase tracking-widest text-[#c4c6d0]/60 mb-1">Registration ID</p>
                  <p className="text-xl font-headline font-black text-[#ffd700] tracking-wider">{registration.registrationId}</p>
                </div>
                <button onClick={copyId} className="flex items-center gap-1.5 text-xs font-headline font-bold uppercase tracking-widest text-[#c4c6d0]/60 hover:text-[#ffd700] transition-colors">
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>content_copy</span>
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Name', value: registration.name },
                  { label: 'District', value: registration.district },
                  { label: 'Registered On', value: new Date(registration.createdAt).toLocaleDateString('en-IN') },
                  registration.type === 'team'
                    ? { label: 'Players', value: `${registration.playerCount} / 15` }
                    : { label: 'Playing Role', value: registration.role?.replace('_', ' ') || '—' },
                ].map(item => (
                  <div key={item.label} className="border-b border-[#444650]/15 pb-3">
                    <p className="text-[0.6rem] font-headline font-bold uppercase tracking-widest text-[#c4c6d0]/50 mb-1">{item.label}</p>
                    <p className="font-headline font-bold text-[#e4e1e9]">{item.value}</p>
                  </div>
                ))}
              </div>

              {/* Player List for team */}
              {registration.type === 'team' && registration.players && registration.players.length > 0 && (
                <div className="mt-4">
                  <p className="text-[0.6rem] font-headline font-bold uppercase tracking-widest text-[#c4c6d0]/50 mb-3">Squad</p>
                  <div className="space-y-1.5">
                    {registration.players.map((p, i) => (
                      <div key={p.id} className={`border px-3 py-2.5 ${
                        p.isIndividual ? 'bg-violet-400/5 border-violet-400/20' : 'bg-[#0b0b0f] border-[#444650]/15'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-[0.6rem] font-headline font-bold text-[#c4c6d0]/30 w-5">{i + 1}</span>
                            <span className="text-sm font-headline font-bold text-[#e4e1e9]">{p.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {p.isIndividual && (
                              <span className="text-[0.55rem] font-headline font-bold uppercase tracking-widest text-violet-400 border border-violet-400/30 bg-violet-400/10 px-1.5 py-0.5">Assigned</span>
                            )}
                            <span className="text-[0.55rem] font-headline font-bold uppercase tracking-widest text-[#ffd700]/70">{p.role.replace('_', ' ')}</span>
                          </div>
                        </div>
                        {p.isIndividual && (
                          <div className="mt-2 ml-7 flex flex-wrap gap-2">
                            <a href={`tel:${p.phone}`}
                              className="flex items-center gap-1.5 bg-violet-400/10 border border-violet-400/30 text-violet-400 px-2.5 py-1 text-xs font-headline font-black uppercase tracking-wide hover:bg-violet-400/20 transition-colors">
                              <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>call</span>
                              {p.phone}
                            </a>
                            <span className="flex items-center gap-1 text-xs text-[#c4c6d0]/50 font-body">
                              <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>school</span>
                              {p.schoolCollege}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-[#c4c6d0]/50 font-body">
                              <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>location_on</span>
                              {p.district}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Team Status */}
            {registration.type === 'team' && registration.status && (() => {
              const s = statusMap[registration.status] || statusMap.PENDING
              return (
                <div className={`bg-[#131318] border p-6 ${s.bg}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`material-symbols-outlined ${s.color}`} style={{ fontSize: '24px' }}>{s.icon}</span>
                    <div>
                      <p className="text-[0.6rem] font-headline font-bold uppercase tracking-widest text-[#c4c6d0]/50">Registration Status</p>
                      <p className={`font-headline font-black text-lg uppercase ${s.color}`}>{s.label}</p>
                    </div>
                  </div>
                  {registration.status === 'PENDING' && <p className="text-[#c4c6d0] text-sm mt-2">Your registration is under review. You will be notified via email once approved.</p>}
                  {registration.status === 'REJECTED' && <p className="text-red-400 text-sm mt-2">Your registration was rejected. Contact info@splcricket.com for details.</p>}
                </div>
              )
            })()}

            {/* Individual Team Assignment */}
            {registration.type === 'individual' && (() => {
              const assigned = registration.teamAssigned
              const team = registration.assignedTeam
              return (
                <div className={`bg-[#131318] border p-6 ${
                  assigned ? 'border-emerald-400/30' : 'border-[#ffd700]/30'
                }`}>
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`material-symbols-outlined ${
                      assigned ? 'text-emerald-400' : 'text-[#ffd700]'
                    }`} style={{ fontSize: '24px' }}>
                      {assigned ? 'check_circle' : 'schedule'}
                    </span>
                    <div>
                      <p className="text-[0.6rem] font-headline font-bold uppercase tracking-widest text-[#c4c6d0]/50">Team Assignment</p>
                      <p className={`font-headline font-black text-lg uppercase ${
                        assigned ? 'text-emerald-400' : 'text-[#ffd700]'
                      }`}>
                        {assigned ? 'Team Assigned' : 'Awaiting Assignment'}
                      </p>
                    </div>
                  </div>

                  {assigned && team ? (
                    <div className="space-y-3">
                      {/* Team name banner */}
                      <div className="bg-[#002366]/50 border border-[#ffd700]/20 px-5 py-4 flex items-center justify-between">
                        <div>
                          <p className="text-[0.6rem] font-headline font-bold uppercase tracking-widest text-[#c4c6d0]/50 mb-1">Assigned Team</p>
                          <p className="font-headline font-black text-xl text-[#ffd700]">{team.name}</p>
                          <p className="text-[#c4c6d0] text-sm">{team.district} · {team.schoolCollege}</p>
                        </div>
                        <span className="material-symbols-outlined text-[#ffd700]/20" style={{ fontSize: '48px' }}>groups</span>
                      </div>

                      {/* Contact details */}
                      <div className="bg-[#0b0b0f] border border-[#444650]/20 p-4">
                        <p className="text-[0.6rem] font-headline font-bold uppercase tracking-widest text-[#c4c6d0]/50 mb-3">Contact Information</p>
                        <div className="space-y-3">
                          {team.managerName && (
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-[#ffd700]/60" style={{ fontSize: '16px' }}>manage_accounts</span>
                                <div>
                                  <p className="text-[0.6rem] font-headline font-bold uppercase tracking-widest text-[#c4c6d0]/40">Team Manager</p>
                                  <p className="text-sm font-headline font-bold text-[#e4e1e9]">{team.managerName}</p>
                                </div>
                              </div>
                              {team.managerPhone && (
                                <a href={`tel:${team.managerPhone}`}
                                  className="flex items-center gap-1.5 bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700] px-3 py-1.5 text-xs font-headline font-black uppercase tracking-wide hover:bg-[#ffd700]/20 transition-colors">
                                  <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>call</span>
                                  {team.managerPhone}
                                </a>
                              )}
                            </div>
                          )}

                          {team.coachName && (
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-[#ffd700]/60" style={{ fontSize: '16px' }}>sports</span>
                                <div>
                                  <p className="text-[0.6rem] font-headline font-bold uppercase tracking-widest text-[#c4c6d0]/40">Coach</p>
                                  <p className="text-sm font-headline font-bold text-[#e4e1e9]">{team.coachName}</p>
                                </div>
                              </div>
                              {team.coachPhone && (
                                <a href={`tel:${team.coachPhone}`}
                                  className="flex items-center gap-1.5 bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700] px-3 py-1.5 text-xs font-headline font-black uppercase tracking-wide hover:bg-[#ffd700]/20 transition-colors">
                                  <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>call</span>
                                  {team.coachPhone}
                                </a>
                              )}
                            </div>
                          )}

                          {team.contactEmail && (
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-[#ffd700]/60" style={{ fontSize: '16px' }}>mail</span>
                                <div>
                                  <p className="text-[0.6rem] font-headline font-bold uppercase tracking-widest text-[#c4c6d0]/40">Team Email</p>
                                  <p className="text-sm font-headline font-bold text-[#e4e1e9]">{team.contactEmail}</p>
                                </div>
                              </div>
                              <a href={`mailto:${team.contactEmail}`}
                                className="flex items-center gap-1.5 bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700] px-3 py-1.5 text-xs font-headline font-black uppercase tracking-wide hover:bg-[#ffd700]/20 transition-colors">
                                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>send</span>
                                Email
                              </a>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="bg-emerald-400/5 border border-emerald-400/20 px-4 py-3 flex items-start gap-2">
                        <span className="material-symbols-outlined text-emerald-400 mt-0.5" style={{ fontSize: '16px' }}>info</span>
                        <p className="text-emerald-400/80 text-xs font-body">Contact your team manager immediately to confirm your availability and get practice schedule details.</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[#c4c6d0] text-sm">The SPL committee will assign you to a team based on your district and playing role. You will receive an email notification once assigned.</p>
                  )}
                </div>
              )
            })()}

            {/* Payment */}
            {(registration.type === 'team' || registration.type === 'individual') && (
              <div className="bg-[#131318] border border-[#444650]/20 p-6">
                <h3 className="font-headline font-black uppercase tracking-tight text-[#e4e1e9] mb-4">Payment Status</h3>
                {registration.payment ? (() => {
                  const s = statusMap[registration.payment.status] || statusMap.PENDING
                  return (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`material-symbols-outlined ${s.color}`} style={{ fontSize: '20px' }}>{s.icon}</span>
                        <span className={`font-headline font-bold uppercase ${s.color}`}>{s.label}</span>
                      </div>
                      <span className="font-headline font-black text-[#ffd700]">₹{registration.payment.amount.toLocaleString('en-IN')}</span>
                    </div>
                  )
                })() : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#ffd700]" style={{ fontSize: '20px' }}>schedule</span>
                      <span className="font-headline font-bold uppercase text-[#ffd700]">Payment Pending</span>
                    </div>
                    <Link href="/register" className="text-xs font-headline font-bold uppercase tracking-widest text-[#ffd700] hover:underline flex items-center gap-1">
                      Complete <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>arrow_forward</span>
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Help */}
            <div className="bg-[#002366]/30 border border-[#ffd700]/15 p-4 text-center text-sm text-[#c4c6d0]">
              Need help? Contact us at{' '}
              <a href="mailto:info@splcricket.com" className="text-[#ffd700] font-semibold hover:underline">info@splcricket.com</a>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}
