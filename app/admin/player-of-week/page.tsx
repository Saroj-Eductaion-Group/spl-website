'use client'

import { useEffect, useState } from 'react'

const inputCls = "w-full bg-[#0b0b0f] border border-[#444650]/40 text-[#e4e1e9] px-4 py-3 text-sm font-body placeholder:text-[#444650] focus:outline-none focus:border-[#ffd700]/60 transition-colors"
const labelCls = "block text-xs font-headline font-bold uppercase tracking-widest text-[#c4c6d0] mb-2"

interface POW {
  id: string; name: string; teamName: string; district: string; role: string
  photoUrl?: string; runs?: string; wickets?: string; impactRating?: string; description?: string
}

export default function AdminPlayerOfWeek() {
  const [current, setCurrent] = useState<POW | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: '', teamName: '', district: '', role: '', photoUrl: '', runs: '', wickets: '', impactRating: '', description: '' })

  useEffect(() => {
    const token = localStorage.getItem('adminToken') || ''
    fetch('/api/admin/player-of-week', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => { if (d) { setCurrent(d); setForm({ name: d.name, teamName: d.teamName, district: d.district, role: d.role, photoUrl: d.photoUrl || '', runs: d.runs || '', wickets: d.wickets || '', impactRating: d.impactRating || '', description: d.description || '' }) } })
      .catch(() => {}).finally(() => setLoading(false))
  }, [])

  const save = async () => {
    if (!form.name || !form.teamName || !form.district || !form.role) return alert('Name, team, district and role are required')
    setSaving(true)
    const token = localStorage.getItem('adminToken') || ''
    const res = await fetch('/api/admin/player-of-week', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(form)
    })
    const data = await res.json()
    setSaving(false)
    if (data.success) { setCurrent(data.player); alert('Player of the Week updated!') }
    else alert(data.error || 'Failed to save')
  }

  const clear = async () => {
    if (!confirm('Remove current Player of the Week?')) return
    const token = localStorage.getItem('adminToken') || ''
    await fetch('/api/admin/player-of-week', { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
    setCurrent(null)
    setForm({ name: '', teamName: '', district: '', role: '', photoUrl: '', runs: '', wickets: '', impactRating: '', description: '' })
  }

  if (loading) return <div className="flex items-center justify-center h-64"><span className="w-8 h-8 border-2 border-[#444650] border-t-[#ffd700] rounded-full animate-spin" /></div>

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline font-black text-3xl italic uppercase tracking-tighter text-[#e4e1e9]">Player of <span className="text-[#ffd700]">The Week</span></h1>
          <p className="text-[#c4c6d0]/60 text-sm mt-1">Set the featured player shown on the homepage</p>
        </div>
        {current && (
          <button onClick={clear} className="flex items-center gap-2 border border-red-400/30 text-red-400 px-4 py-2 text-xs font-headline font-bold uppercase tracking-widest hover:bg-red-400/10 transition-colors">
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>delete</span> Clear
          </button>
        )}
      </div>

      {current && (
        <div className="bg-[#131318] border border-[#ffd700]/20 p-5 flex items-center gap-4">
          <span className="material-symbols-outlined text-[#ffd700]" style={{ fontSize: '32px' }}>emoji_events</span>
          <div>
            <p className="font-headline font-black text-[#ffd700] uppercase">{current.name}</p>
            <p className="text-sm text-[#c4c6d0]/60">{current.role} · {current.teamName} · {current.district}</p>
          </div>
          <span className="ml-auto text-[0.6rem] font-headline font-bold uppercase tracking-widest text-emerald-400 border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5">Active</span>
        </div>
      )}

      <div className="bg-[#131318] border border-[#444650]/20 p-6 space-y-4">
        <h2 className="font-headline font-black text-lg uppercase tracking-tight text-[#ffd700]">{current ? 'Update' : 'Set'} Player of the Week</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div><label className={labelCls}>Player Name *</label><input className={inputCls} placeholder="Full name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
          <div><label className={labelCls}>Team Name *</label><input className={inputCls} placeholder="Team name" value={form.teamName} onChange={e => setForm(f => ({ ...f, teamName: e.target.value }))} /></div>
          <div><label className={labelCls}>District *</label><input className={inputCls} placeholder="District" value={form.district} onChange={e => setForm(f => ({ ...f, district: e.target.value }))} /></div>
          <div>
            <label className={labelCls}>Playing Role *</label>
            <select className={inputCls} value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
              <option value="">Select Role</option>
              <option value="Batsman">Batsman</option>
              <option value="Bowler">Bowler</option>
              <option value="All-Rounder">All-Rounder</option>
              <option value="Wicket-Keeper">Wicket-Keeper</option>
            </select>
          </div>
          <div><label className={labelCls}>Runs Scored</label><input className={inputCls} placeholder="e.g. 142*" value={form.runs} onChange={e => setForm(f => ({ ...f, runs: e.target.value }))} /></div>
          <div><label className={labelCls}>Best Bowling</label><input className={inputCls} placeholder="e.g. 3/12" value={form.wickets} onChange={e => setForm(f => ({ ...f, wickets: e.target.value }))} /></div>
          <div><label className={labelCls}>Impact Rating</label><input className={inputCls} placeholder="e.g. 9.8" value={form.impactRating} onChange={e => setForm(f => ({ ...f, impactRating: e.target.value }))} /></div>
          <div><label className={labelCls}>Photo URL</label><input className={inputCls} placeholder="https://..." value={form.photoUrl} onChange={e => setForm(f => ({ ...f, photoUrl: e.target.value }))} /></div>
          <div className="md:col-span-2"><label className={labelCls}>Description</label><textarea className={inputCls} rows={2} placeholder="Short description..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
        </div>
        <button onClick={save} disabled={saving}
          className="flex items-center gap-2 bg-[#ffd700] text-[#002366] px-6 py-3 font-headline font-black uppercase tracking-tight text-sm hover:brightness-110 transition-all disabled:opacity-50">
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>save</span>
          {saving ? 'Saving...' : 'Save Player of the Week'}
        </button>
      </div>
    </div>
  )
}
