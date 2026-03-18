'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Plus, Trash2 } from 'lucide-react'
import DocumentUpload from '@/components/DocumentUpload'

interface Player {
  name: string
  dateOfBirth: string
  phone: string
  aadhaarNo: string
  aadhaarDoc: string
  schoolIdDoc: string
  dobProofDoc: string
  photoDoc: string
}

interface TeamFormData {
  teamName: string
  district: string
  schoolCollege: string
  coachName: string
  coachPhone: string
  managerName: string
  managerPhone: string
  email: string
}

const districts = [
  'Agra', 'Aligarh', 'Allahabad', 'Ambedkar Nagar', 'Amethi', 'Amroha', 'Auraiya', 'Azamgarh',
  'Baghpat', 'Bahraich', 'Ballia', 'Balrampur', 'Banda', 'Barabanki', 'Bareilly', 'Basti',
  'Bhadohi', 'Bijnor', 'Budaun', 'Bulandshahr', 'Chandauli', 'Chitrakoot', 'Deoria', 'Etah',
  'Etawah', 'Faizabad', 'Farrukhabad', 'Fatehpur', 'Firozabad', 'Gautam Buddha Nagar', 'Ghaziabad',
  'Ghazipur', 'Gonda', 'Gorakhpur', 'Hamirpur', 'Hapur', 'Hardoi', 'Hathras', 'Jalaun', 'Jaunpur',
  'Jhasi', 'Kannauj', 'Kanpur Dehat', 'Kanpur Nagar', 'Kasganj', 'Kaushambi', 'Kheri', 'Kushinagar',
  'Lalitpur', 'Lucknow', 'Maharajganj', 'Mahoba', 'Mainpuri', 'Mathura', 'Mau', 'Meerut', 'Mirzapur',
  'Moradabad', 'Muzaffarnagar', 'Pilibhit', 'Pratapgarh', 'Raebareli', 'Rampur', 'Saharanpur',
  'Sambhal', 'Sant Kabir Nagar', 'Shahjahanpur', 'Shamli', 'Shravasti', 'Siddharthnagar', 'Sitapur',
  'Sonbhadra', 'Sultanpur', 'Unnao', 'Varanasi'
]

const emptyPlayer = (): Player => ({ name: '', dateOfBirth: '', phone: '', aadhaarNo: '', aadhaarDoc: '', schoolIdDoc: '', dobProofDoc: '', photoDoc: '' })

export default function TeamRegistrationForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<TeamFormData>()
  const [players, setPlayers] = useState<Player[]>([emptyPlayer()])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [expandedPlayer, setExpandedPlayer] = useState<number>(0)

  const addPlayer = () => {
    if (players.length < 15) {
      setPlayers([...players, emptyPlayer()])
      setExpandedPlayer(players.length)
    }
  }

  const removePlayer = (index: number) => {
    if (players.length > 1) setPlayers(players.filter((_, i) => i !== index))
  }

  const updatePlayer = (index: number, field: keyof Player, value: string) => {
    const updated = [...players]
    updated[index][field] = value
    setPlayers(updated)
  }

  const onSubmit = async (data: TeamFormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/register/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, players })
      })
      const result = await response.json()
      if (response.ok && result.success) {
        window.location.href = `/register/success?registrationId=${result.registrationId}&name=${encodeURIComponent(result.name)}&type=team`
      } else {
        alert(result.error || 'Registration failed. Please try again.')
      }
    } catch {
      alert('Registration failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Team Details */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-6 text-primary-600">Team Details</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="form-label">Team Name *</label>
            <input {...register('teamName', { required: 'Team name is required' })} className="form-input" placeholder="Enter team name" />
            {errors.teamName && <p className="text-red-500 text-sm mt-1">{errors.teamName.message}</p>}
          </div>
          <div>
            <label className="form-label">District *</label>
            <select {...register('district', { required: 'District is required' })} className="form-input">
              <option value="">Select District</option>
              {districts.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            {errors.district && <p className="text-red-500 text-sm mt-1">{errors.district.message}</p>}
          </div>
          <div className="md:col-span-2">
            <label className="form-label">School/College Name *</label>
            <input {...register('schoolCollege', { required: 'School/College name is required' })} className="form-input" placeholder="Enter school or college name" />
            {errors.schoolCollege && <p className="text-red-500 text-sm mt-1">{errors.schoolCollege.message}</p>}
          </div>
          <div>
            <label className="form-label">Coach Name</label>
            <input {...register('coachName')} className="form-input" placeholder="Enter coach name" />
          </div>
          <div>
            <label className="form-label">Coach Phone</label>
            <input {...register('coachPhone')} className="form-input" placeholder="Enter coach phone" />
          </div>
          <div>
            <label className="form-label">Manager Name</label>
            <input {...register('managerName')} className="form-input" placeholder="Enter manager name" />
          </div>
          <div>
            <label className="form-label">Manager Phone</label>
            <input {...register('managerPhone')} className="form-input" placeholder="Enter manager phone" />
          </div>
          <div className="md:col-span-2">
            <label className="form-label">Email ID * (for confirmation)</label>
            <input type="email" {...register('email', { required: 'Email is required' })} className="form-input" placeholder="Enter team email" />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>
        </div>
      </div>

      {/* Players */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-primary-600">Players ({players.length}/15)</h2>
          <button type="button" onClick={addPlayer} disabled={players.length >= 15} className="btn-primary flex items-center gap-2 disabled:opacity-50">
            <Plus className="w-4 h-4" /> Add Player
          </button>
        </div>

        <div className="space-y-4">
          {players.map((player, index) => (
            <div key={index} className="border border-gray-200 rounded-xl overflow-hidden">
              {/* Player Header - click to expand */}
              <div
                className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer"
                onClick={() => setExpandedPlayer(expandedPlayer === index ? -1 : index)}
              >
                <h3 className="font-medium text-gray-800">
                  Player {index + 1} {player.name && `— ${player.name}`}
                </h3>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500">
                    {[player.aadhaarDoc, player.schoolIdDoc, player.dobProofDoc, player.photoDoc].filter(Boolean).length}/4 docs
                  </span>
                  {players.length > 1 && (
                    <button type="button" onClick={e => { e.stopPropagation(); removePlayer(index) }} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <span className="text-gray-400">{expandedPlayer === index ? '▲' : '▼'}</span>
                </div>
              </div>

              {expandedPlayer === index && (
                <div className="p-4 space-y-6">
                  {/* Basic Info */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">Full Name *</label>
                      <input value={player.name} onChange={e => updatePlayer(index, 'name', e.target.value)} className="form-input" placeholder="Player full name" required />
                    </div>
                    <div>
                      <label className="form-label">Date of Birth *</label>
                      <input type="date" value={player.dateOfBirth} onChange={e => updatePlayer(index, 'dateOfBirth', e.target.value)} className="form-input" required />
                    </div>
                    <div>
                      <label className="form-label">Mobile Number *</label>
                      <input value={player.phone} onChange={e => updatePlayer(index, 'phone', e.target.value)} className="form-input" placeholder="Mobile number" required />
                    </div>
                    <div>
                      <label className="form-label">Aadhaar Number *</label>
                      <input value={player.aadhaarNo} onChange={e => updatePlayer(index, 'aadhaarNo', e.target.value)} className="form-input" placeholder="12-digit Aadhaar number" required />
                    </div>
                  </div>

                  {/* Document Upload */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Documents (Mandatory)</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <DocumentUpload
                        label="Aadhaar Card"
                        name={`player_${index}_aadhaar`}
                        required
                        onChange={url => updatePlayer(index, 'aadhaarDoc', url || '')}
                      />
                      <DocumentUpload
                        label="School/College ID"
                        name={`player_${index}_schoolId`}
                        required
                        onChange={url => updatePlayer(index, 'schoolIdDoc', url || '')}
                      />
                      <DocumentUpload
                        label="Date of Birth Proof"
                        name={`player_${index}_dob`}
                        required
                        onChange={url => updatePlayer(index, 'dobProofDoc', url || '')}
                      />
                      <DocumentUpload
                        label="Passport Size Photo"
                        name={`player_${index}_photo`}
                        required
                        onChange={url => updatePlayer(index, 'photoDoc', url || '')}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Declaration */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4 text-primary-600">Declaration</h2>
        <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 space-y-1 mb-4">
          <p>I hereby declare that:</p>
          <ul className="ml-4 space-y-1">
            <li>• All information provided is true and correct</li>
            <li>• All players meet the Under-19, Class 12 eligibility criteria</li>
            <li>• Any false information may lead to team disqualification</li>
            <li>• Registration fee of ₹11,000 is non-refundable</li>
          </ul>
        </div>
        <label className="flex items-start gap-3">
          <input type="checkbox" required className="mt-1" />
          <span className="text-sm">I agree to the above declaration and SPL tournament terms & conditions</span>
        </label>
      </div>

      {/* Important Notes */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-800">
        <p className="font-semibold mb-2">Important Notes:</p>
        <ul className="space-y-1">
          <li>• Age fraud will lead to immediate disqualification</li>
          <li>• Team registration fee ₹11,000 is non-refundable</li>
          <li>• All player documents are mandatory for verification</li>
        </ul>
      </div>

      <div className="card text-center">
        <p className="text-gray-600 mb-4">Registration Fee: <span className="font-bold text-primary-600 text-lg">₹11,000</span></p>
        <button type="submit" disabled={isSubmitting} className="btn-primary disabled:opacity-50 px-12 py-3 text-lg">
          {isSubmitting ? 'Submitting...' : 'Register Team'}
        </button>
      </div>
    </form>
  )
}
