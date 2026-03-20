'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import DocumentUpload from '@/components/DocumentUpload'

interface Player {
  name: string; dateOfBirth: string; phone: string; aadhaarNo: string
  role: string; aadhaarDoc: string; schoolIdDoc: string; dobProofDoc: string; photoDoc: string
}
interface TeamFormData {
  teamName: string; district: string; schoolCollege: string
  coachName: string; coachPhone: string; managerName: string; managerPhone: string; email: string
}

const districts = [
  'Agra','Aligarh','Allahabad','Ambedkar Nagar','Amethi','Amroha','Auraiya','Azamgarh','Baghpat',
  'Bahraich','Ballia','Balrampur','Banda','Barabanki','Bareilly','Basti','Bhadohi','Bijnor','Budaun',
  'Bulandshahr','Chandauli','Chitrakoot','Deoria','Etah','Etawah','Faizabad','Farrukhabad','Fatehpur',
  'Firozabad','Gautam Buddha Nagar','Ghaziabad','Ghazipur','Gonda','Gorakhpur','Hamirpur','Hapur',
  'Hardoi','Hathras','Jalaun','Jaunpur','Jhasi','Kannauj','Kanpur Dehat','Kanpur Nagar','Kasganj',
  'Kaushambi','Kheri','Kushinagar','Lalitpur','Lucknow','Maharajganj','Mahoba','Mainpuri','Mathura',
  'Mau','Meerut','Mirzapur','Moradabad','Muzaffarnagar','Pilibhit','Pratapgarh','Raebareli','Rampur',
  'Saharanpur','Sambhal','Sant Kabir Nagar','Shahjahanpur','Shamli','Shravasti','Siddharthnagar',
  'Sitapur','Sonbhadra','Sultanpur','Unnao','Varanasi'
]

const emptyPlayer = (): Player => ({ name:'',dateOfBirth:'',phone:'',aadhaarNo:'',role:'',aadhaarDoc:'',schoolIdDoc:'',dobProofDoc:'',photoDoc:'' })

const inputCls = "w-full bg-[#0b0b0f] border border-[#444650]/40 text-[#e4e1e9] px-4 py-3 text-sm font-body placeholder:text-[#444650] focus:outline-none focus:border-[#ffd700]/60 transition-colors"
const labelCls = "block text-xs font-headline font-bold uppercase tracking-widest text-[#c4c6d0] mb-2"
const sectionCls = "bg-[#131318] border border-[#444650]/20 p-6 md:p-8"

export default function TeamRegistrationForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<TeamFormData>()
  const [players, setPlayers] = useState<Player[]>([emptyPlayer()])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [expandedPlayer, setExpandedPlayer] = useState(0)

  const addPlayer = () => { if (players.length < 15) { setPlayers([...players, emptyPlayer()]); setExpandedPlayer(players.length) } }
  const removePlayer = (i: number) => { if (players.length > 1) setPlayers(players.filter((_, idx) => idx !== i)) }
  const updatePlayer = (i: number, field: keyof Player, value: string) => {
    const u = [...players]; u[i][field] = value; setPlayers(u)
  }

  const onSubmit = async (data: TeamFormData) => {
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/register/team', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...data, players }) })
      const result = await res.json()
      if (res.ok && result.success) {
        const payRes = await fetch('/api/payment/initiate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ registrationId: result.registrationId, amount: 11000, email: data.email, phone: data.managerPhone || data.coachPhone, name: data.teamName, registrationType: 'team', teamId: result.teamId }) })
        const payData = await payRes.json()
        if (payData.success && payData.paymentUrl) window.location.href = payData.paymentUrl
        else alert(payData.error || 'Payment initiation failed')
      } else { alert(result.error || 'Registration failed. Please try again.') }
    } catch { alert('Registration failed. Please try again.') }
    finally { setIsSubmitting(false) }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

      {/* Team Details */}
      <div className={sectionCls}>
        <div className="flex items-center gap-3 mb-6">
          <span className="material-symbols-outlined text-[#ffd700]">groups</span>
          <h2 className="font-headline font-black text-xl uppercase tracking-tight text-[#ffd700]">Team Details</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          <div><label className={labelCls}>Team Name *</label>
            <input {...register('teamName', { required: true })} className={inputCls} placeholder="Enter team name" />
            {errors.teamName && <p className="text-red-400 text-xs mt-1">Team name is required</p>}
          </div>
          <div><label className={labelCls}>District *</label>
            <select {...register('district', { required: true })} className={inputCls}>
              <option value="">Select District</option>
              {districts.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            {errors.district && <p className="text-red-400 text-xs mt-1">District is required</p>}
          </div>
          <div className="md:col-span-2"><label className={labelCls}>School/College Name *</label>
            <input {...register('schoolCollege', { required: true })} className={inputCls} placeholder="Enter school or college name" />
            {errors.schoolCollege && <p className="text-red-400 text-xs mt-1">School/College name is required</p>}
          </div>
          <div><label className={labelCls}>Coach Name</label><input {...register('coachName')} className={inputCls} placeholder="Coach name" /></div>
          <div><label className={labelCls}>Coach Phone</label><input {...register('coachPhone')} className={inputCls} placeholder="Coach phone" /></div>
          <div><label className={labelCls}>Manager Name</label><input {...register('managerName')} className={inputCls} placeholder="Manager name" /></div>
          <div><label className={labelCls}>Manager Phone</label><input {...register('managerPhone')} className={inputCls} placeholder="Manager phone" /></div>
          <div className="md:col-span-2"><label className={labelCls}>Email ID * (for confirmation)</label>
            <input type="email" {...register('email', { required: true })} className={inputCls} placeholder="Team email" />
            {errors.email && <p className="text-red-400 text-xs mt-1">Email is required</p>}
          </div>
        </div>
      </div>

      {/* Players */}
      <div className={sectionCls}>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#ffd700]">sports_cricket</span>
            <h2 className="font-headline font-black text-xl uppercase tracking-tight text-[#ffd700]">Players ({players.length}/15)</h2>
          </div>
          <button type="button" onClick={addPlayer} disabled={players.length >= 15}
            className="flex items-center gap-2 bg-[#ffd700] text-[#002366] px-4 py-2 font-headline font-black uppercase tracking-tight text-xs hover:brightness-110 transition-all disabled:opacity-40">
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>add</span> Add Player
          </button>
        </div>

        <div className="space-y-3">
          {players.map((player, index) => (
            <div key={index} className="border border-[#444650]/20">
              <div className="flex justify-between items-center p-4 bg-[#0b0b0f] cursor-pointer"
                onClick={() => setExpandedPlayer(expandedPlayer === index ? -1 : index)}>
                <h3 className="font-headline font-bold uppercase tracking-tight text-sm text-[#e4e1e9]">
                  Player {index + 1}{player.name && ` — ${player.name}`}
                </h3>
                <div className="flex items-center gap-3">
                  <span className="text-[0.6rem] font-headline font-bold uppercase tracking-widest text-[#c4c6d0]/50">
                    {[player.aadhaarDoc, player.schoolIdDoc, player.dobProofDoc, player.photoDoc].filter(Boolean).length}/4 docs
                  </span>
                  {players.length > 1 && (
                    <button type="button" onClick={e => { e.stopPropagation(); removePlayer(index) }}
                      className="text-red-400/60 hover:text-red-400 transition-colors">
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
                    </button>
                  )}
                  <span className="material-symbols-outlined text-[#c4c6d0]/40" style={{ fontSize: '18px' }}>
                    {expandedPlayer === index ? 'expand_less' : 'expand_more'}
                  </span>
                </div>
              </div>

              {expandedPlayer === index && (
                <div className="p-5 space-y-5 border-t border-[#444650]/20">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div><label className={labelCls}>Full Name *</label><input value={player.name} onChange={e => updatePlayer(index,'name',e.target.value)} className={inputCls} placeholder="Player full name" required /></div>
                    <div><label className={labelCls}>Date of Birth *</label><input type="date" value={player.dateOfBirth} onChange={e => updatePlayer(index,'dateOfBirth',e.target.value)} className={inputCls} required /></div>
                    <div><label className={labelCls}>Mobile Number *</label><input value={player.phone} onChange={e => updatePlayer(index,'phone',e.target.value)} className={inputCls} placeholder="Mobile number" required /></div>
                    <div><label className={labelCls}>Aadhaar Number *</label><input value={player.aadhaarNo} onChange={e => updatePlayer(index,'aadhaarNo',e.target.value)} className={inputCls} placeholder="12-digit Aadhaar" maxLength={12} required /></div>
                    <div><label className={labelCls}>Playing Role *</label>
                      <select value={player.role} onChange={e => updatePlayer(index,'role',e.target.value)} className={inputCls} required>
                        <option value="">Select Role</option>
                        <option value="BATSMAN">Batsman</option>
                        <option value="BOWLER">Bowler</option>
                        <option value="ALL_ROUNDER">All-Rounder</option>
                        <option value="WICKET_KEEPER">Wicket-Keeper</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <p className={labelCls}>Documents (Mandatory)</p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <DocumentUpload label="Aadhaar Card" name={`p${index}_aadhaar`} required onChange={url => updatePlayer(index,'aadhaarDoc',url||'')} />
                      <DocumentUpload label="School/College ID" name={`p${index}_schoolId`} required onChange={url => updatePlayer(index,'schoolIdDoc',url||'')} />
                      <DocumentUpload label="Date of Birth Proof" name={`p${index}_dob`} required onChange={url => updatePlayer(index,'dobProofDoc',url||'')} />
                      <DocumentUpload label="Passport Size Photo" name={`p${index}_photo`} required onChange={url => updatePlayer(index,'photoDoc',url||'')} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Declaration */}
      <div className={sectionCls}>
        <h2 className="font-headline font-black text-xl uppercase tracking-tight text-[#ffd700] mb-4">Declaration</h2>
        <div className="bg-[#ffd700]/5 border border-[#ffd700]/20 p-5 text-sm text-[#c4c6d0] space-y-1 mb-5">
          <p className="text-[#e4e1e9] font-semibold mb-2">I hereby declare that:</p>
          <p>• All information provided is true and correct</p>
          <p>• All players meet the Under-19, Class 12 eligibility criteria</p>
          <p>• Any false information may lead to team disqualification</p>
          <p>• Registration fee of ₹11,000 is non-refundable</p>
        </div>
        <label className="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" required className="mt-1 accent-[#ffd700]" />
          <span className="text-sm text-[#c4c6d0]">I agree to the above declaration and SPL tournament terms & conditions</span>
        </label>
      </div>

      {/* Warning */}
      <div className="bg-[#ffd700]/5 border border-[#ffd700]/20 p-4 text-sm text-[#c4c6d0]">
        <p className="font-headline font-bold uppercase tracking-wide text-[#ffd700] mb-2">Important Notes</p>
        <p>• Age fraud will lead to immediate disqualification</p>
        <p>• Team registration fee ₹11,000 is non-refundable</p>
        <p>• All player documents are mandatory for verification</p>
      </div>

      {/* Submit */}
      <div className={`${sectionCls} text-center`}>
        <p className="text-[#c4c6d0] mb-4">Registration Fee: <span className="font-headline font-black text-[#ffd700] text-xl">₹11,000</span></p>
        <button type="submit" disabled={isSubmitting}
          className="bg-[#ffd700] text-[#002366] px-12 py-4 font-headline font-black uppercase tracking-tight text-lg hover:brightness-110 transition-all disabled:opacity-50">
          {isSubmitting ? 'Submitting...' : 'Register Team & Pay'}
        </button>
      </div>
    </form>
  )
}
