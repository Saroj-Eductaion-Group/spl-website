'use client'

import { useEffect, useState } from 'react'

type Message = { id: string; name: string; email: string; phone?: string; subject?: string; message: string; read: boolean; createdAt: string }

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Message | null>(null)

  const getHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('adminToken') || ''}`
  })

  const load = () => {
    fetch('/api/admin/messages', { headers: getHeaders() })
      .then(r => r.json()).then(data => { setMessages(Array.isArray(data) ? data : []); setLoading(false) })
  }

  useEffect(() => { load() }, [])

  const markRead = async (msg: Message) => {
    setSelected(msg)
    if (!msg.read) {
      await fetch('/api/admin/messages', { method: 'PATCH', headers: getHeaders(), body: JSON.stringify({ id: msg.id }) })
      setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, read: true } : m))
    }
  }

  const del = async (id: string) => {
    await fetch('/api/admin/messages', { method: 'DELETE', headers: getHeaders(), body: JSON.stringify({ id }) })
    setMessages(prev => prev.filter(m => m.id !== id))
    if (selected?.id === id) setSelected(null)
  }

  const unread = messages.filter(m => !m.read).length

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <span className="w-8 h-8 border-2 border-[#444650] border-t-[#ffd700] rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="font-headline font-black text-4xl italic uppercase tracking-tighter text-[#e4e1e9]">
          Contact <span className="text-[#ffd700]">Messages</span>
        </h1>
        <p className="text-[#c4c6d0]/60 text-sm mt-1">
          <span className="text-[#ffd700] font-bold">{unread}</span> unread of {messages.length} total
        </p>
      </div>

      {messages.length === 0 ? (
        <div className="bg-[#131318] border border-[#444650]/20 text-center py-16">
          <span className="material-symbols-outlined text-[#c4c6d0]/20 mb-3 block" style={{ fontSize: '48px' }}>mail</span>
          <p className="text-[#c4c6d0]/30 font-headline uppercase tracking-widest text-sm">No messages yet</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* List */}
          <div className="space-y-2">
            {messages.map(msg => (
              <div key={msg.id} onClick={() => markRead(msg)}
                className={`p-4 border cursor-pointer transition-colors ${
                  selected?.id === msg.id
                    ? 'border-[#ffd700]/40 bg-[#ffd700]/5'
                    : msg.read
                    ? 'border-[#444650]/20 bg-[#131318] hover:bg-[#1c1c21]'
                    : 'border-[#002366]/60 bg-[#002366]/20 hover:bg-[#002366]/30'
                }`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`material-symbols-outlined flex-shrink-0 ${msg.read ? 'text-[#c4c6d0]/30' : 'text-[#ffd700]'}`} style={{ fontSize: '16px' }}>
                      {msg.read ? 'drafts' : 'mail'}
                    </span>
                    <div className="min-w-0">
                      <p className={`text-sm truncate font-headline uppercase tracking-tight ${msg.read ? 'text-[#c4c6d0]/70' : 'font-black text-[#e4e1e9]'}`}>{msg.name}</p>
                      <p className="text-xs text-[#c4c6d0]/40 truncate">{msg.subject || 'General Inquiry'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs text-[#c4c6d0]/30">{new Date(msg.createdAt).toLocaleDateString('en-IN')}</span>
                    <button onClick={e => { e.stopPropagation(); del(msg.id) }} className="text-[#c4c6d0]/30 hover:text-red-400 transition-colors">
                      <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>delete</span>
                    </button>
                  </div>
                </div>
                <p className="text-xs text-[#c4c6d0]/40 mt-1 truncate ml-6">{msg.message}</p>
              </div>
            ))}
          </div>

          {/* Detail */}
          <div className="bg-[#131318] border border-[#444650]/20 p-6 h-fit">
            {selected ? (
              <>
                <div className="flex items-start justify-between mb-4">
                  <h2 className="font-headline font-black text-lg uppercase tracking-tight text-[#e4e1e9]">{selected.subject || 'General Inquiry'}</h2>
                  <span className="text-xs text-[#c4c6d0]/30">{new Date(selected.createdAt).toLocaleString('en-IN')}</span>
                </div>
                <div className="space-y-2 mb-4 pb-4 border-b border-[#444650]/20">
                  <p className="text-sm text-[#c4c6d0]"><span className="text-[#c4c6d0]/50 font-headline font-bold uppercase tracking-widest text-xs">From: </span>{selected.name}</p>
                  <p className="text-sm flex items-center gap-1">
                    <span className="text-[#c4c6d0]/50 font-headline font-bold uppercase tracking-widest text-xs">Email: </span>
                    <a href={`mailto:${selected.email}`} className="text-[#ffd700] hover:underline">{selected.email}</a>
                  </p>
                  {selected.phone && (
                    <p className="text-sm flex items-center gap-1">
                      <span className="material-symbols-outlined text-[#c4c6d0]/30" style={{ fontSize: '14px' }}>phone</span>
                      <a href={`tel:${selected.phone}`} className="text-[#ffd700] hover:underline">{selected.phone}</a>
                    </p>
                  )}
                </div>
                <p className="text-sm text-[#c4c6d0] whitespace-pre-wrap leading-relaxed">{selected.message}</p>
                <a href={`mailto:${selected.email}?subject=Re: ${selected.subject || 'Your SPL Inquiry'}`}
                  className="mt-5 inline-flex items-center gap-2 bg-[#ffd700] text-[#002366] px-5 py-2.5 font-headline font-black uppercase tracking-tight text-sm hover:brightness-110 transition-all">
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>reply</span>
                  Reply via Email
                </a>
              </>
            ) : (
              <div className="text-center py-12">
                <span className="material-symbols-outlined text-[#c4c6d0]/20 mb-3 block" style={{ fontSize: '48px' }}>mark_email_unread</span>
                <p className="text-sm text-[#c4c6d0]/30 font-headline uppercase tracking-widest">Select a message to read</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
