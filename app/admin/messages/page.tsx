'use client'

import { useEffect, useState } from 'react'
import { Mail, MailOpen, Trash2, Phone } from 'lucide-react'

type Message = { id: string; name: string; email: string; phone?: string; subject?: string; message: string; read: boolean; createdAt: string }

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Message | null>(null)

  const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : ''
  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }

  const load = () => {
    fetch('/api/admin/messages', { headers }).then(r => r.json()).then(setMessages).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const markRead = async (msg: Message) => {
    setSelected(msg)
    if (!msg.read) {
      await fetch('/api/admin/messages', { method: 'PATCH', headers, body: JSON.stringify({ id: msg.id }) })
      setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, read: true } : m))
    }
  }

  const del = async (id: string) => {
    await fetch('/api/admin/messages', { method: 'DELETE', headers, body: JSON.stringify({ id }) })
    setMessages(prev => prev.filter(m => m.id !== id))
    if (selected?.id === id) setSelected(null)
  }

  const unread = messages.filter(m => !m.read).length

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contact Messages</h1>
          <p className="text-sm text-gray-500 mt-1">{unread} unread of {messages.length} total</p>
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="text-center py-16 text-gray-400">No messages yet</div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* List */}
          <div className="space-y-2">
            {messages.map(msg => (
              <div
                key={msg.id}
                onClick={() => markRead(msg)}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  selected?.id === msg.id ? 'border-primary-400 bg-primary-50' :
                  msg.read ? 'border-gray-200 bg-white hover:bg-gray-50' : 'border-blue-200 bg-blue-50 hover:bg-blue-100'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    {msg.read ? <MailOpen className="w-4 h-4 text-gray-400 flex-shrink-0" /> : <Mail className="w-4 h-4 text-blue-500 flex-shrink-0" />}
                    <div className="min-w-0">
                      <p className={`text-sm truncate ${msg.read ? 'font-medium text-gray-700' : 'font-bold text-gray-900'}`}>{msg.name}</p>
                      <p className="text-xs text-gray-500 truncate">{msg.subject || 'General Inquiry'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs text-gray-400">{new Date(msg.createdAt).toLocaleDateString('en-IN')}</span>
                    <button onClick={e => { e.stopPropagation(); del(msg.id) }} className="text-red-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1 truncate ml-6">{msg.message}</p>
              </div>
            ))}
          </div>

          {/* Detail */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 h-fit">
            {selected ? (
              <>
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">{selected.subject || 'General Inquiry'}</h2>
                  <span className="text-xs text-gray-400">{new Date(selected.createdAt).toLocaleString('en-IN')}</span>
                </div>
                <div className="space-y-2 mb-4 pb-4 border-b border-gray-100">
                  <p className="text-sm"><span className="font-medium text-gray-600">From:</span> {selected.name}</p>
                  <p className="text-sm flex items-center gap-1"><span className="font-medium text-gray-600">Email:</span>
                    <a href={`mailto:${selected.email}`} className="text-primary-600 hover:underline">{selected.email}</a>
                  </p>
                  {selected.phone && (
                    <p className="text-sm flex items-center gap-1"><Phone className="w-3 h-3 text-gray-400" />
                      <a href={`tel:${selected.phone}`} className="text-primary-600 hover:underline">{selected.phone}</a>
                    </p>
                  )}
                </div>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{selected.message}</p>
                <a href={`mailto:${selected.email}?subject=Re: ${selected.subject || 'Your SPL Inquiry'}`}
                  className="mt-4 inline-flex items-center gap-2 btn-primary text-sm">
                  <Mail className="w-4 h-4" /> Reply via Email
                </a>
              </>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <Mail className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Select a message to read</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
