'use client'

import { useEffect, useState } from 'react'
import { Plus, Trash2, Bell, ToggleLeft, ToggleRight } from 'lucide-react'

interface Announcement {
  id: string; title: string; content: string; type: string; active: boolean; createdAt: string
}

const typeColors: Record<string, string> = {
  INFO: 'bg-blue-100 text-blue-700',
  IMPORTANT: 'bg-red-100 text-red-700',
  UPDATE: 'bg-green-100 text-green-700',
}

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', content: '', type: 'INFO' })
  const [saving, setSaving] = useState(false)

  useEffect(() => { loadAnnouncements() }, [])

  const loadAnnouncements = async () => {
    const token = localStorage.getItem('adminToken') || ''
    const res = await fetch('/api/admin/announcements', { headers: { Authorization: `Bearer ${token}` } })
    setAnnouncements(await res.json())
    setLoading(false)
  }

  const createAnnouncement = async () => {
    if (!form.title || !form.content) return alert('Title and content are required')
    setSaving(true)
    const token = localStorage.getItem('adminToken') || ''
    const res = await fetch('/api/admin/announcements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(form)
    })
    setSaving(false)
    if ((await res.json()).success) {
      setShowForm(false)
      setForm({ title: '', content: '', type: 'INFO' })
      loadAnnouncements()
    }
  }

  const toggleActive = async (id: string, active: boolean) => {
    const token = localStorage.getItem('adminToken') || ''
    await fetch('/api/admin/announcements', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id, active: !active })
    })
    loadAnnouncements()
  }

  const deleteAnnouncement = async (id: string) => {
    if (!confirm('Delete this announcement?')) return
    const token = localStorage.getItem('adminToken') || ''
    await fetch('/api/admin/announcements', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id })
    })
    loadAnnouncements()
  }

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div></div>

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary-600">Announcements</h1>
          <p className="text-gray-600">Manage news and announcements shown on the website</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Announcement
        </button>
      </div>

      {showForm && (
        <div className="card mb-8">
          <h2 className="text-xl font-semibold mb-4 text-primary-600">New Announcement</h2>
          <div className="space-y-4">
            <div>
              <label className="form-label">Title *</label>
              <input className="form-input" placeholder="Announcement title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            </div>
            <div>
              <label className="form-label">Content *</label>
              <textarea className="form-input" rows={4} placeholder="Announcement content" value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} />
            </div>
            <div>
              <label className="form-label">Type</label>
              <select className="form-input" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                <option value="INFO">Info</option>
                <option value="IMPORTANT">Important</option>
                <option value="UPDATE">Update</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={createAnnouncement} disabled={saving} className="btn-primary disabled:opacity-50">{saving ? 'Publishing...' : 'Publish'}</button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {announcements.map(ann => (
          <div key={ann.id} className={`card border-l-4 ${ann.active ? 'border-green-400' : 'border-gray-300 opacity-60'}`}>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Bell className="w-4 h-4 text-gray-500" />
                  <h3 className="font-semibold text-gray-900">{ann.title}</h3>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${typeColors[ann.type] || 'bg-gray-100 text-gray-600'}`}>{ann.type}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${ann.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{ann.active ? 'Active' : 'Hidden'}</span>
                </div>
                <p className="text-gray-600 text-sm ml-7">{ann.content}</p>
                <p className="text-xs text-gray-400 ml-7 mt-2">{new Date(ann.createdAt).toLocaleDateString('en-IN')}</p>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <button onClick={() => toggleActive(ann.id, ann.active)} className={ann.active ? 'text-green-600 hover:text-green-800' : 'text-gray-400 hover:text-gray-600'} title={ann.active ? 'Hide' : 'Show'}>
                  {ann.active ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                </button>
                <button onClick={() => deleteAnnouncement(ann.id)} className="text-red-400 hover:text-red-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {announcements.length === 0 && (
          <div className="text-center py-12 text-gray-400">No announcements yet</div>
        )}
      </div>
    </div>
  )
}
