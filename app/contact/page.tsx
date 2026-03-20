'use client'

import { useState } from 'react'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      if (res.ok) { setStatus('sent'); setForm({ name: '', email: '', phone: '', subject: '', message: '' }) }
      else setStatus('error')
    } catch { setStatus('error') }
  }

  const inputClass = "w-full bg-[#0b0b0f] border border-[#444650]/40 text-[#e4e1e9] px-4 py-3 font-body text-sm placeholder-[#c4c6d0]/30 focus:outline-none focus:border-[#ffd700] transition-colors"
  const labelClass = "block text-xs font-headline font-bold uppercase tracking-widest text-[#c4c6d0] mb-2"

  return (
    <div className="min-h-screen bg-[#0b0b0f] text-[#e4e1e9] pt-20">

      {/* Hero */}
      <section className="spl-hero border-b border-[#ffd700]/15">
        <div className="max-w-screen-xl mx-auto relative z-10">
          <p className="text-[#ffd700] font-headline font-bold text-xs tracking-[0.3em] uppercase mb-4">Get in Touch</p>
          <h1 className="font-headline font-black text-5xl md:text-7xl italic uppercase tracking-tighter leading-[0.9] mb-6 text-white">
            CONTACT <br /><span className="text-[#ffd700]">US</span>
          </h1>
          <p className="text-white/70 text-lg max-w-2xl">Get in touch with SPL Tournament Team</p>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-screen-xl mx-auto grid md:grid-cols-2 gap-12">

          {/* Info */}
          <div>
            <div className="w-24 h-1 bg-[#ffd700] mb-8" />
            <h2 className="font-headline font-black text-3xl uppercase tracking-tighter italic mb-10">Tournament Office</h2>
            <div className="space-y-8">
              {[
                { icon: '📍', title: 'Address', lines: ['Saroj Educational Group', 'Lucknow, Uttar Pradesh', 'India — 226001'] },
                { icon: '📞', title: 'Phone', lines: ['Main Office: +91 XXXXX XXXXX', 'Registration Help: +91 XXXXX XXXXX'] },
                { icon: '✉️', title: 'Email', lines: ['General: info@splcricket.com', 'Support: support@splcricket.com'] },
                { icon: '🕐', title: 'Office Hours', lines: ['Mon–Fri: 9:00 AM – 6:00 PM', 'Saturday: 9:00 AM – 2:00 PM', 'Sunday: Closed'] },
              ].map(item => (
                <div key={item.title} className="flex gap-6 border-b border-[#444650]/15 pb-8">
                  <span className="text-2xl flex-shrink-0">{item.icon}</span>
                  <div>
                    <h3 className="font-headline font-bold uppercase tracking-tight text-[#ffd700] mb-2 text-sm">{item.title}</h3>
                    {item.lines.map(l => <p key={l} className="text-[#c4c6d0] text-sm">{l}</p>)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div>
            <div className="w-24 h-1 bg-[#ffd700] mb-8" />
            <h2 className="font-headline font-black text-3xl uppercase tracking-tighter italic mb-10">Send Message</h2>

            {status === 'sent' ? (
              <div className="bg-[#131318] border border-[#ffd700]/20 p-10 text-center">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="font-headline font-black text-2xl uppercase tracking-tighter text-[#ffd700] mb-2">Message Sent!</h3>
                <p className="text-[#c4c6d0] text-sm mb-6">We will get back to you within 24 hours.</p>
                <button onClick={() => setStatus('idle')} className="border border-[#ffd700] text-[#ffd700] px-6 py-2 font-headline font-bold uppercase tracking-tight text-sm hover:bg-[#ffd700] hover:text-[#002366] transition-all">
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>Full Name *</label>
                    <input type="text" className={inputClass} placeholder="Your name" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div>
                    <label className={labelClass}>Email *</label>
                    <input type="email" className={inputClass} placeholder="Your email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>Phone</label>
                    <input type="tel" className={inputClass} placeholder="Your phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                  </div>
                  <div>
                    <label className={labelClass}>Subject</label>
                    <select className={inputClass} value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}>
                      <option value="">Select subject</option>
                      <option>Registration Query</option>
                      <option>Payment Issue</option>
                      <option>Technical Support</option>
                      <option>General Inquiry</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Message *</label>
                  <textarea className={inputClass} rows={5} placeholder="Your message" required value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
                </div>
                {status === 'error' && <p className="text-red-400 text-sm font-headline">Failed to send. Please try again.</p>}
                <button type="submit" disabled={status === 'sending'} className="w-full bg-[#ffd700] text-[#002366] py-4 font-headline font-black uppercase tracking-tight hover:brightness-110 transition-all disabled:opacity-50">
                  {status === 'sending' ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Quick Info */}
      <section className="py-12 px-6 bg-[#131318] border-t border-[#444650]/15">
        <div className="max-w-screen-xl mx-auto grid md:grid-cols-3 gap-0">
          {[
            { icon: '📞', title: '24/7 Helpline', desc: 'Call us anytime for urgent queries during tournament period' },
            { icon: '✉️', title: 'Quick Response', desc: 'Email responses within 24 hours on business days' },
            { icon: '🏢', title: 'Visit Office', desc: 'Walk-in consultations available during office hours' },
          ].map((item, i) => (
            <div key={item.title} className={`p-8 text-center ${i < 2 ? 'border-b md:border-b-0 md:border-r border-[#444650]/15' : ''}`}>
              <div className="text-3xl mb-3">{item.icon}</div>
              <h3 className="font-headline font-bold uppercase tracking-tight mb-2">{item.title}</h3>
              <p className="text-[#c4c6d0] text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
