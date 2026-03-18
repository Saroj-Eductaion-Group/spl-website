'use client'

import { useEffect, useState } from 'react'
import { Plus, Trash2, Shield } from 'lucide-react'

interface Coordinator {
  id: string; name: string; email: string; phone?: string
  coordinatorDistrict?: string; createdAt: string
}

const districts = [
  'Agra','Aligarh','Allahabad','Ambedkar Nagar','Amethi','Amroha','Auraiya','Azamgarh',
  'Baghpat','Bahraich','Ballia','Balrampur','Banda','Barabanki','Bareilly','Basti',
  'Bhadohi','Bijnor','Budaun','Bulandshahr','Chandauli','Chitrakoot','Deoria','Etah',
  'Etawah','Faizabad','Farrukhabad','Fatehpur','Firozabad','Gautam Buddha Nagar','Ghaziabad',
  'Ghazipur','Gonda','Gorakhpur','Hamirpur','Hapur','Hardoi','Hathras','Jalaun','Jaunpur',
  'Jhasi','Kannauj','Kanpur Dehat','Kanpur Nagar','Kasganj','Kaushambi','Kheri','Kushinagar',
  'Lalitpur','Lucknow','Maharajganj','Mahoba','Mainpuri','Mathura','Mau','Meerut','Mirzapur',
  'Moradabad','Muzaffarnagar','Pilibhit','Pratapgarh','Raebareli','Rampur','Saharanpur',
  'Sambhal','Sant Kabir Nagar','Shahjahanpur','Shamli','Shravasti','Siddharthnagar','Sitapur',
  'Sonbhadra','Sultanpur','Unnao','Varanasi'
]

export default function AdminCoordinators() {
  const [coordinators, setCoordinators] = useState<Coordinator[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', district: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => { loadCoordinators() }, [])

  const loadCoordinators = async () => {
    const token = localStorage.getItem('adminToken') || ''
    const res = await fetch('/api/admin/coordinators', { headers: { Authorization: `Bearer ${token}` } })
    setCoordinators(await res.json())
    setLoading(false)
  }

  const createCoordinator = async () => {
    if (!form.name || !form.email || !form.password || !form.district) return alert('Fill all required fields')
    setSaving(true)
    const token = localStorage.getItem('adminToken') || ''
    const res = await fetch('/api/admin/coordinators', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(form)
    })
    const data = await res.json()
    setSaving(false)
    if (data.success) {
      setShowForm(false)
      setForm({ name: '', email: '', phone: '', password: '', district: '' })
      loadCoordinators()
    } else {
      alert(data.error || 'Failed to create coordinator')
    }
  }

  const deleteCoordinator = async (id: string) => {
    if (!confirm('Delete this coordinator?')) return
    const token = localStorage.getItem('adminToken') || ''
    await fetch('/api/admin/coordinators', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id })
    })
    loadCoordinators()
  }

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div></div>

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary-600">District Coordinators</h1>
          <p className="text-gray-600">Manage district-level coordinators</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Coordinator
        </button>
      </div>

      {showForm && (
        <div className="card mb-8">
          <h2 className="text-xl font-semibold mb-4 text-primary-600">New Coordinator</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Full Name *</label>
              <input className="form-input" placeholder="Enter name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="form-label">Email *</label>
              <input type="email" className="form-input" placeholder="Enter email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="form-label">Phone</label>
              <input className="form-input" placeholder="Enter phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <label className="form-label">Password *</label>
              <input type="password" className="form-input" placeholder="Set password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
            </div>
            <div className="md:col-span-2">
              <label className="form-label">Assigned District *</label>
              <select className="form-input" value={form.district} onChange={e => setForm({ ...form, district: e.target.value })}>
                <option value="">Select District</option>
                {districts.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={createCoordinator} disabled={saving} className="btn-primary disabled:opacity-50">{saving ? 'Creating...' : 'Create Coordinator'}</button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coordinators.map(coord => (
          <div key={coord.id} className="card">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-primary-100 p-2 rounded-lg">
                <Shield className="w-6 h-6 text-primary-600" />
              </div>
              <button onClick={() => deleteCoordinator(coord.id)} className="text-red-400 hover:text-red-600">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">{coord.name}</h3>
            <p className="text-sm text-gray-500 mb-1">{coord.email}</p>
            {coord.phone && <p className="text-sm text-gray-500 mb-2">{coord.phone}</p>}
            <span className="inline-block bg-gold-100 text-gold-800 text-xs font-semibold px-3 py-1 rounded-full">
              {coord.coordinatorDistrict || 'No District'}
            </span>
            <p className="text-xs text-gray-400 mt-3">Added: {new Date(coord.createdAt).toLocaleDateString('en-IN')}</p>
          </div>
        ))}
        {coordinators.length === 0 && (
          <div className="col-span-3 text-center py-12 text-gray-400">No coordinators added yet</div>
        )}
      </div>
    </div>
  )
}
