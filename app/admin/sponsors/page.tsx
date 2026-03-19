'use client'

import { useEffect, useState } from 'react'
import { Plus, Trash2, ToggleLeft, ToggleRight, ExternalLink } from 'lucide-react'

interface Sponsor {
  id: string; name: string; tier: string; logoUrl?: string; website?: string; active: boolean; createdAt: string
}

const tierColors: Record<string, string> = {
  TITLE: 'bg-yellow-100 text-yellow-800',
  OFFICIAL: 'bg-blue-100 text-blue-800',
  ASSOCIATE: 'bg-gray-100 text-gray-700',
}

const tierOrder = ['TITLE', 'OFFICIAL', 'ASSOCIATE']

export default function AdminSponsors() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', tier: 'ASSOCIATE', logoUrl: '', website: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => { loadSponsors() }, [])

  const loadSponsors = async () => {
    const res = await fetch('/api/admin/sponsors')
    setSponsors(await res.json())
    setLoading(false)
  }

  const createSponsor = async () => {
    if (!form.name) return alert('Sponsor name is required')
    setSaving(true)
    const token = localStorage.getItem('adminToken') || ''
    const res = await fetch('/api/admin/sponsors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(form)
    })
    setSaving(false)
    if ((await res.json()).success) {
      setShowForm(false)
      setForm({ name: '', tier: 'ASSOCIATE', logoUrl: '', website: '' })
      loadSponsors()
    }
  }

  const toggleActive = async (id: string, active: boolean) => {
    const token = localStorage.getItem('adminToken') || ''
    await fetch('/api/admin/sponsors', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id, active: !active })
    })
    loadSponsors()
  }

  const deleteSponsor = async (id: string) => {
    if (!confirm('Delete this sponsor?')) return
    const token = localStorage.getItem('adminToken') || ''
    await fetch('/api/admin/sponsors', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id })
    })
    loadSponsors()
  }

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div></div>

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary-600">Sponsors</h1>
          <p className="text-gray-600">Manage sponsors shown on the website</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Sponsor
        </button>
      </div>

      {showForm && (
        <div className="card mb-8">
          <h2 className="text-xl font-semibold mb-4 text-primary-600">New Sponsor</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Sponsor Name *</label>
              <input className="form-input" placeholder="e.g. Saroj International University" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="form-label">Tier</label>
              <select className="form-input" value={form.tier} onChange={e => setForm({ ...form, tier: e.target.value })}>
                <option value="TITLE">Title Sponsor</option>
                <option value="OFFICIAL">Official Partner</option>
                <option value="ASSOCIATE">Associate Sponsor</option>
              </select>
            </div>
            <div>
              <label className="form-label">Logo URL (optional)</label>
              <input className="form-input" placeholder="https://example.com/logo.png" value={form.logoUrl} onChange={e => setForm({ ...form, logoUrl: e.target.value })} />
            </div>
            <div>
              <label className="form-label">Website (optional)</label>
              <input className="form-input" placeholder="https://example.com" value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={createSponsor} disabled={saving} className="btn-primary disabled:opacity-50">{saving ? 'Saving...' : 'Add Sponsor'}</button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
          </div>
        </div>
      )}

      {tierOrder.map(tier => {
        const tierSponsors = sponsors.filter(s => s.tier === tier)
        if (tierSponsors.length === 0) return null
        return (
          <div key={tier} className="mb-8">
            <h2 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${tierColors[tier]}`}>{tier}</span>
              {tier === 'TITLE' ? 'Title Sponsors' : tier === 'OFFICIAL' ? 'Official Partners' : 'Associate Sponsors'}
            </h2>
            <div className="space-y-3">
              {tierSponsors.map(sponsor => (
                <div key={sponsor.id} className={`card border-l-4 ${sponsor.active ? 'border-green-400' : 'border-gray-300 opacity-60'}`}>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      {sponsor.logoUrl ? (
                        <img src={sponsor.logoUrl} alt={sponsor.name} className="h-10 w-20 object-contain rounded border border-gray-200 bg-white p-1" />
                      ) : (
                        <div className="h-10 w-20 bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-xs text-gray-400">No Logo</div>
                      )}
                      <div>
                        <h3 className="font-semibold text-gray-900">{sponsor.name}</h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${tierColors[sponsor.tier]}`}>{sponsor.tier}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${sponsor.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{sponsor.active ? 'Visible' : 'Hidden'}</span>
                          {sponsor.website && (
                            <a href={sponsor.website} target="_blank" rel="noopener noreferrer" className="text-xs text-primary-600 flex items-center gap-1 hover:underline">
                              <ExternalLink className="w-3 h-3" /> Website
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => toggleActive(sponsor.id, sponsor.active)} className={sponsor.active ? 'text-green-600 hover:text-green-800' : 'text-gray-400 hover:text-gray-600'} title={sponsor.active ? 'Hide' : 'Show'}>
                        {sponsor.active ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                      </button>
                      <button onClick={() => deleteSponsor(sponsor.id)} className="text-red-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}

      {sponsors.length === 0 && (
        <div className="text-center py-12 text-gray-400">No sponsors added yet. Click "Add Sponsor" to get started.</div>
      )}
    </div>
  )
}
