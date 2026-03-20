'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import DocumentUpload from '@/components/DocumentUpload'

interface IndividualFormData {
  name: string; fatherName: string; dateOfBirth: string; phone: string; alternatePhone: string
  schoolCollege: string; district: string; role: string; position: string; experience: string
  email: string; aadhaarNo: string
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

const inputCls = "w-full bg-[#0b0b0f] border border-[#444650]/40 text-[#e4e1e9] px-4 py-3 text-sm font-body placeholder:text-[#444650] focus:outline-none focus:border-[#ffd700]/60 transition-colors"
const labelCls = "block text-xs font-headline font-bold uppercase tracking-widest text-[#c4c6d0] mb-2"
const sectionCls = "bg-[#131318] border border-[#444650]/20 p-6 md:p-8"

export default function IndividualRegistrationForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<IndividualFormData>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [documents, setDocuments] = useState({ aadhaarDoc: '', schoolIdDoc: '', dobProofDoc: '', photoDoc: '' })

  const onSubmit = async (data: IndividualFormData) => {
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/register/individual', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...data, ...documents }) })
      const result = await res.json()
      if (res.ok && result.success) {
        const payRes = await fetch('/api/payment/initiate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ registrationId: result.registrationId, amount: 1000, email: data.email, phone: data.phone, name: data.name, registrationType: 'individual', playerId: result.playerId }) })
        const payData = await payRes.json()
        if (payData.success && payData.paymentUrl) window.location.href = payData.paymentUrl
        else alert(payData.error || 'Payment initiation failed')
      } else { alert(result.error || 'Registration failed. Please try again.') }
    } catch { alert('Registration failed. Please try again.') }
    finally { setIsSubmitting(false) }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

      {/* Personal Details */}
      <div className={sectionCls}>
        <div className="flex items-center gap-3 mb-6">
          <span className="material-symbols-outlined text-[#ffd700]">person</span>
          <h2 className="font-headline font-black text-xl uppercase tracking-tight text-[#ffd700]">Personal Details</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          <div><label className={labelCls}>Full Name *</label>
            <input {...register('name', { required: true })} className={inputCls} placeholder="Your full name" />
            {errors.name && <p className="text-red-400 text-xs mt-1">Name is required</p>}
          </div>
          <div><label className={labelCls}>Father/Guardian Name *</label>
            <input {...register('fatherName', { required: true })} className={inputCls} placeholder="Father/Guardian name" />
            {errors.fatherName && <p className="text-red-400 text-xs mt-1">Father/Guardian name is required</p>}
          </div>
          <div><label className={labelCls}>Date of Birth *</label>
            <input type="date" {...register('dateOfBirth', { required: true })} className={inputCls} />
            {errors.dateOfBirth && <p className="text-red-400 text-xs mt-1">Date of birth is required</p>}
          </div>
          <div><label className={labelCls}>Mobile Number *</label>
            <input {...register('phone', { required: true })} className={inputCls} placeholder="Mobile number" />
            {errors.phone && <p className="text-red-400 text-xs mt-1">Mobile number is required</p>}
          </div>
          <div><label className={labelCls}>Alternate Mobile</label>
            <input {...register('alternatePhone')} className={inputCls} placeholder="Alternate number" />
          </div>
          <div><label className={labelCls}>Aadhaar Number *</label>
            <input {...register('aadhaarNo', { required: true, pattern: /^\d{12}$/ })} className={inputCls} placeholder="12-digit Aadhaar" maxLength={12} />
            {errors.aadhaarNo && <p className="text-red-400 text-xs mt-1">Valid 12-digit Aadhaar required</p>}
          </div>
          <div><label className={labelCls}>Email ID *</label>
            <input type="email" {...register('email', { required: true })} className={inputCls} placeholder="Email address" />
            {errors.email && <p className="text-red-400 text-xs mt-1">Email is required</p>}
          </div>
          <div><label className={labelCls}>District *</label>
            <select {...register('district', { required: true })} className={inputCls}>
              <option value="">Select District</option>
              {districts.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            {errors.district && <p className="text-red-400 text-xs mt-1">District is required</p>}
          </div>
          <div className="md:col-span-2"><label className={labelCls}>School/College Name *</label>
            <input {...register('schoolCollege', { required: true })} className={inputCls} placeholder="School or college name" />
            {errors.schoolCollege && <p className="text-red-400 text-xs mt-1">School/College name is required</p>}
          </div>
        </div>
      </div>

      {/* Playing Details */}
      <div className={sectionCls}>
        <div className="flex items-center gap-3 mb-6">
          <span className="material-symbols-outlined text-[#ffd700]">sports_cricket</span>
          <h2 className="font-headline font-black text-xl uppercase tracking-tight text-[#ffd700]">Playing Details</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          <div><label className={labelCls}>Preferred Playing Role *</label>
            <select {...register('role', { required: true })} className={inputCls}>
              <option value="">Select Role</option>
              <option value="BATSMAN">Batsman</option>
              <option value="BOWLER">Bowler</option>
              <option value="ALL_ROUNDER">All-Rounder</option>
              <option value="WICKET_KEEPER">Wicket-Keeper</option>
            </select>
            {errors.role && <p className="text-red-400 text-xs mt-1">Playing role is required</p>}
          </div>
          <div><label className={labelCls}>Preferred Position</label>
            <select {...register('position')} className={inputCls}>
              <option value="">Select Position</option>
              <option value="TOP_ORDER">Top Order</option>
              <option value="MIDDLE_ORDER">Middle Order</option>
              <option value="FAST_BOWLER">Fast Bowler</option>
              <option value="SPINNER">Spinner</option>
              <option value="WICKET_KEEPER">Wicket-Keeper</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className={labelCls}>Playing Experience</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[['SCHOOL','School Level'],['DISTRICT','District Level'],['ACADEMY','Academy'],['NONE','None']].map(([val, lbl]) => (
                <label key={val} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" {...register('experience')} value={val} className="accent-[#ffd700]" />
                  <span className="text-sm text-[#c4c6d0]">{lbl}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Documents */}
      <div className={sectionCls}>
        <div className="flex items-center gap-3 mb-6">
          <span className="material-symbols-outlined text-[#ffd700]">upload_file</span>
          <h2 className="font-headline font-black text-xl uppercase tracking-tight text-[#ffd700]">Document Upload (Mandatory)</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          <DocumentUpload label="Aadhaar Card" name="aadhaarDoc" required onChange={url => setDocuments(p => ({ ...p, aadhaarDoc: url||'' }))} />
          <DocumentUpload label="School/College ID" name="schoolIdDoc" required onChange={url => setDocuments(p => ({ ...p, schoolIdDoc: url||'' }))} />
          <DocumentUpload label="Date of Birth Proof" name="dobProofDoc" required onChange={url => setDocuments(p => ({ ...p, dobProofDoc: url||'' }))} />
          <DocumentUpload label="Passport Size Photo" name="photoDoc" required onChange={url => setDocuments(p => ({ ...p, photoDoc: url||'' }))} />
        </div>
      </div>

      {/* Consent */}
      <div className={sectionCls}>
        <h2 className="font-headline font-black text-xl uppercase tracking-tight text-[#ffd700] mb-5">Consent & Declaration</h2>
        <div className="space-y-4 mb-5">
          <div className="bg-[#ffd700]/5 border border-[#ffd700]/20 p-4 text-sm text-[#c4c6d0]">
            <p className="font-headline font-bold uppercase text-[#ffd700] mb-2">Team Formation</p>
            <p>• SPL authorities will assign me to a district-level team</p>
            <p>• Team formation is based on district, role, and availability</p>
            <p>• SPL committee's decision will be final</p>
          </div>
          <div className="bg-[#002366]/30 border border-[#ffd700]/15 p-4 text-sm text-[#c4c6d0]">
            <p className="font-headline font-bold uppercase text-[#ffd700] mb-2">Scholarship Acknowledgement</p>
            <p>• Participation makes me eligible for 50% scholarship at Saroj International University</p>
            <p>• Admission is subject to university norms</p>
          </div>
        </div>
        <label className="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" required className="mt-1 accent-[#ffd700]" />
          <span className="text-sm text-[#c4c6d0]">I declare all information is true and correct. I agree to SPL terms & conditions.</span>
        </label>
      </div>

      {/* Submit */}
      <div className={`${sectionCls} text-center`}>
        <p className="text-[#c4c6d0] mb-4">Registration Fee: <span className="font-headline font-black text-[#ffd700] text-xl">₹1,000</span></p>
        <button type="submit" disabled={isSubmitting}
          className="bg-[#ffd700] text-[#002366] px-12 py-4 font-headline font-black uppercase tracking-tight text-lg hover:brightness-110 transition-all disabled:opacity-50">
          {isSubmitting ? 'Processing...' : 'Proceed to Payment'}
        </button>
      </div>
    </form>
  )
}
