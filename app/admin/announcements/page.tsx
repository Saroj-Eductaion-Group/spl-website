'use client'

import { useEffect, useState } from 'react'

interface Announcement {
  id: string; title: string; content: string; type: string; active: boolean; createdAt: string
}

const typeStyle: Record<string, string> = {
  INFO:      'text-[#ffd700] border-[#ffd700]/30 bg-[#ffd700]/10',
  IMPORTANT: 'text-red-400 border-red-400/30 bg-red-400/10',
  UPDATE:    'text-emerald-400 border-emerald-400/30 bg-emerald-400/10',
}

const inputCls = "w-full bg-[#0b0b0f] border border-[#444650]/40 text-[#e4e1e9] px-4 py-3 text-sm font-body placeholder:text-[#444650] focus:outline-none focus:border-[#ffd700]/60 transition-colors"
const labelCls = "block text-xs font-headline font-bold uppercase tracking-widest text-[#c4c6d0] mb-2"

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', content: '', type: 'INFO' })
  const [saving, setSaving] = useState(false)

  useEffect(() => { load() }, [])

  const load = async () => {
    const token = localStorage.getItem('adminToken') || ''
    const res = await fetch('/api/admin/announcements', { headers: { Authorization: `Bearer ${token}` } })
    const data = await res.json()
    setAnnouncements(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  const create = async () => {
    if (!form.title || !form.content) return alert('Title and content are required')
    setSaving(true)
    const token = localStorage.getItem('adminToken') || ''
    const res = await fetch('/api/admin/announcements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(form)
    })
    setSaving(false)
    if ((await res.json()).success) { setShowForm(false); setForm({ title: '', content: '', type: 'INFO' }); load() }
  }

  const toggle = async (id: string, active: boolean) => {
    const token = localStorage.getItem('adminToken') || ''
    await fetch('/api/admin/announcements', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id, active: !active })
    })
    load()
  }

  const del = async (id: string) => {
    if (!confirm('Delete this announcement?')) return
    const token = localStorage.getItem('adminToken') || ''
    await fetch('/api/admin/announcements', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id })
    })
    load()
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <span className="w-8 h-8 border-2 border-[#444650] border-t-[#ffd700] rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-headline font-black text-4xl italic uppercase tracking-tighter text-[#e4e1e9]">
            <span className="text-[#ffd700]">Announcements</span>
          </h1>
          <p className="text-[#c4c6d0]/60 text-sm mt-1">Manage news and announcements shown on the website</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-[#ffd700] text-[#002366] px-5 py-2.5 font-headline font-black uppercase tracking-tight text-sm hover:brightness-110 transition-all">
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
          New Announcement
        </button>
      </div>

      {showForm && (
        <div className="bg-[#131318] border border-[#444650]/20 p-6">
          <h2 className="font-headline font-black text-xl uppercase tracking-tight text-[#ffd700] mb-5">New Announcement</h2>
          <div className="space-y-4">
            <div><label className={labelCls}>Title *</label><input className={inputCls} placeholder="Announcement title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
            <div><label className={labelCls}>Content *</label><textarea className={inputCls} rows={4} placeholder="Announcement content" value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} /></div>
            <div>
              <label className={labelCls}>Type</label>
              <select className={inputCls} value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                <option value="INFO">Info</option>
                <option value="IMPORTANT">Important</option>
                <option value="UPDATE">Update</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <button onClick={create} disabled={saving}
              className="bg-[#ffd700] text-[#002366] px-6 py-2.5 font-headline font-black uppercase tracking-tight text-sm hover:brightness-110 transition-all disabled:opacity-50">
              {saving ? 'Publishing...' : 'Publish'}
            </button>
            <button onClick={() => setShowForm(false)}
              className="border border-[#444650]/40 text-[#c4c6d0] px-6 py-2.5 font-headline font-bold uppercase tracking-tight text-sm hover:border-[#ffd700] hover:text-[#ffd700] transition-all">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {announcements.map(ann => (
          <div key={ann.id} className={`bg-[#131318] border border-l-4 p-5 transition-opacity ${ann.active ? 'border-[#444650]/20 border-l-[#ffd700]' : 'border-[#444650]/20 border-l-[#444650]/40 opacity-50'}`}>
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <span className="material-symbols-outlined text-[#c4c6d0]/40" style={{ fontSize: '16px' }}>campaign</span>
                  <h3 className="font-headline font-black text-[#e4e1e9] uppercase tracking-tight">{ann.title}</h3>
                  <span className={`text-[0.6rem] font-headline font-bold uppercase tracking-widest border px-2 py-0.5 ${typeStyle[ann.type] || typeStyle.INFO}`}>{ann.type}</span>
                  <span className={`text-[0.6rem] font-headline font-bold uppercase tracking-widest border px-2 py-0.5 ${ann.active ? 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10' : 'text-[#c4c6d0]/40 border-[#444650]/30'}`}>
                    {ann.active ? 'Active' : 'Hidden'}
                  </span>
                </div>
                <p className="text-[#c4c6d0]/70 text-sm ml-6">{ann.content}</p>
                <p className="text-xs text-[#c4c6d0]/30 ml-6 mt-2">{new Date(ann.createdAt).toLocaleDateString('en-IN')}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => toggle(ann.id, ann.active)}
                  className={`transition-colors ${ann.active ? 'text-emerald-400 hover:text-emerald-300' : 'text-[#c4c6d0]/30 hover:text-[#ffd700]'}`}
                  title={ann.active ? 'Hide' : 'Show'}>
                  <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>{ann.active ? 'toggle_on' : 'toggle_off'}</span>
                </button>
                <button onClick={() => del(ann.id)} className="text-[#c4c6d0]/30 hover:text-red-400 transition-colors">
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
        {announcements.length === 0 && (
          <div className="text-center py-12 text-[#c4c6d0]/30 font-headline uppercase tracking-widest text-sm">No announcements yet</div>
        )}
      </div>
    </div>
  )
}
