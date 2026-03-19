'use client'

import { useEffect, useState } from 'react'
import { Send, Users, Trophy, Bell } from 'lucide-react'

interface Team {
  id: string; name: string; district: string; contactEmail?: string; status: string
}

export default function AdminNotifications() {
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<{ sent: number; failed: number } | null>(null)
  const [form, setForm] = useState({ target: 'ALL_TEAMS', district: '', subject: '', message: '' })

  useEffect(() => {
    const token = localStorage.getItem('adminToken') || ''
    fetch('/api/admin/teams', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(data => { setTeams(Array.isArray(data) ? data : []); setLoading(false) })
  }, [])

  const districts = Array.from(new Set(teams.map(t => t.district))).sort()

  const getTargets = () => {
    if (form.target === 'ALL_TEAMS') return teams.filter(t => t.contactEmail)
    if (form.target === 'APPROVED') return teams.filter(t => t.status === 'APPROVED' && t.contactEmail)
    if (form.target === 'PENDING') return teams.filter(t => t.status === 'PENDING' && t.contactEmail)
    if (form.target === 'DISTRICT') return teams.filter(t => t.district === form.district && t.contactEmail)
    return []
  }

  const sendNotification = async () => {
    if (!form.subject || !form.message) return alert('Subject and message are required')
    const targets = getTargets()
    if (targets.length === 0) return alert('No teams with email found for selected target')
    if (!confirm(`Send email to ${targets.length} team(s)?`)) return
    setSending(true)
    setResult(null)
    const token = localStorage.getItem('adminToken') || ''
    const res = await fetch('/api/admin/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ subject: form.subject, message: form.message, teamIds: targets.map(t => t.id) })
    })
    const data = await res.json()
    setSending(false)
    if (data.success) {
      setResult({ sent: data.sent, failed: data.failed })
      setForm(f => ({ ...f, subject: '', message: '' }))
    } else {
      alert(data.error || 'Failed to send')
    }
  }

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div></div>

  const targetCount = getTargets().length

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary-600">Notification Management</h1>
        <p className="text-gray-600">Send email notifications to teams</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="card text-center">
          <Trophy className="w-8 h-8 text-primary-500 mx-auto mb-2" />
          <p className="text-2xl font-bold">{teams.length}</p>
          <p className="text-sm text-gray-500">Total Teams</p>
        </div>
        <div className="card text-center">
          <Users className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <p className="text-2xl font-bold">{teams.filter(t => t.contactEmail).length}</p>
          <p className="text-sm text-gray-500">Teams with Email</p>
        </div>
        <div className="card text-center">
          <Bell className="w-8 h-8 text-gold-500 mx-auto mb-2" />
          <p className="text-2xl font-bold">{targetCount}</p>
          <p className="text-sm text-gray-500">Selected Recipients</p>
        </div>
      </div>

      {result && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700 font-semibold">✅ Notification sent!</p>
          <p className="text-sm text-green-600">Sent: {result.sent} | Failed: {result.failed}</p>
        </div>
      )}

      <div className="card space-y-6">
        <h2 className="text-xl font-semibold text-primary-600">Compose Notification</h2>

        <div>
          <label className="form-label">Send To *</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { value: 'ALL_TEAMS', label: 'All Teams' },
              { value: 'APPROVED', label: 'Approved' },
              { value: 'PENDING', label: 'Pending' },
              { value: 'DISTRICT', label: 'By District' },
            ].map(opt => (
              <button key={opt.value} type="button"
                onClick={() => setForm(f => ({ ...f, target: opt.value }))}
                className={`p-3 rounded-lg border-2 text-sm font-medium transition-colors ${form.target === opt.value ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {form.target === 'DISTRICT' && (
          <div>
            <label className="form-label">Select District *</label>
            <select className="form-input" value={form.district} onChange={e => setForm(f => ({ ...f, district: e.target.value }))}>
              <option value="">Choose district</option>
              {districts.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        )}

        <div className="bg-primary-50 rounded-lg px-4 py-2 text-sm text-primary-700">
          📧 This will send email to <strong>{targetCount}</strong> team(s)
        </div>

        <div>
          <label className="form-label">Subject *</label>
          <input className="form-input" placeholder="e.g. Match Schedule Update — SPL U19"
            value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} />
        </div>

        <div>
          <label className="form-label">Message *</label>
          <textarea className="form-input" rows={6} placeholder="Write your message here..."
            value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />
        </div>

        <button onClick={sendNotification} disabled={sending || targetCount === 0}
          className="btn-primary flex items-center gap-2 disabled:opacity-50">
          <Send className="w-4 h-4" />
          {sending ? 'Sending...' : `Send to ${targetCount} Team(s)`}
        </button>
      </div>

      <div className="card mt-8">
        <h3 className="font-semibold text-gray-800 mb-4">Recipients Preview</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Team</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">District</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {getTargets().slice(0, 10).map(team => (
                <tr key={team.id}>
                  <td className="px-4 py-2 font-medium text-gray-900">{team.name}</td>
                  <td className="px-4 py-2 text-gray-600">{team.district}</td>
                  <td className="px-4 py-2 text-gray-600">{team.contactEmail || '—'}</td>
                  <td className="px-4 py-2">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${team.status === 'APPROVED' ? 'bg-green-100 text-green-700' : team.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {team.status}
                    </span>
                  </td>
                </tr>
              ))}
              {getTargets().length === 0 && (
                <tr><td colSpan={4} className="px-4 py-6 text-center text-gray-400">No recipients selected</td></tr>
              )}
            </tbody>
          </table>
          {getTargets().length > 10 && <p className="text-xs text-gray-400 px-4 py-2">...and {getTargets().length - 10} more</p>}
        </div>
      </div>
    </div>
  )
}
