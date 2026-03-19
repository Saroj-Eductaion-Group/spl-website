'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin, Clock } from 'lucide-react'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      if (res.ok) {
        setStatus('sent')
        setForm({ name: '', email: '', phone: '', subject: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="page-hero">
        <div className="container mx-auto px-4 text-center">
          <h1 className="page-hero-title">Contact Us</h1>
          <p className="page-hero-sub">Get in touch with SPL Tournament Team</p>
        </div>
      </div>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="card">
              <h2 className="text-2xl font-semibold mb-6 text-primary-600">Tournament Office</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-primary-500 mt-1" />
                  <div>
                    <h3 className="font-semibold">Address</h3>
                    <p className="text-gray-600">
                      Saroj Educational Group<br />
                      Lucknow, Uttar Pradesh<br />
                      India - 226001
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-primary-500 mt-1" />
                  <div>
                    <h3 className="font-semibold">Phone Numbers</h3>
                    <p className="text-gray-600">
                      Main Office: +91 XXXXX XXXXX<br />
                      Registration Help: +91 XXXXX XXXXX
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-primary-500 mt-1" />
                  <div>
                    <h3 className="font-semibold">Email</h3>
                    <p className="text-gray-600">
                      General: info@splcricket.com<br />
                      Support: support@splcricket.com
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-primary-500 mt-1" />
                  <div>
                    <h3 className="font-semibold">Office Hours</h3>
                    <p className="text-gray-600">
                      Monday – Friday: 9:00 AM – 6:00 PM<br />
                      Saturday: 9:00 AM – 2:00 PM<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <h2 className="text-2xl font-semibold mb-6 text-gold-600">Send Message</h2>

              {status === 'sent' ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                  <p className="text-green-700 font-semibold text-lg mb-1">Message Sent!</p>
                  <p className="text-green-600 text-sm">We will get back to you within 24 hours.</p>
                  <button onClick={() => setStatus('idle')} className="mt-4 text-sm text-primary-600 underline">Send another message</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="form-label">Full Name *</label>
                    <input type="text" className="form-input" placeholder="Enter your name" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div>
                    <label className="form-label">Email Address *</label>
                    <input type="email" className="form-input" placeholder="Enter your email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                  </div>
                  <div>
                    <label className="form-label">Phone Number</label>
                    <input type="tel" className="form-input" placeholder="Enter your phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                  </div>
                  <div>
                    <label className="form-label">Subject</label>
                    <select className="form-input" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}>
                      <option value="">Select subject</option>
                      <option>Registration Query</option>
                      <option>Payment Issue</option>
                      <option>Technical Support</option>
                      <option>General Inquiry</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Message *</label>
                    <textarea className="form-input" rows={4} placeholder="Enter your message" required value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
                  </div>
                  {status === 'error' && <p className="text-red-500 text-sm">Failed to send. Please try again.</p>}
                  <button type="submit" disabled={status === 'sending'} className="btn-primary w-full disabled:opacity-50">
                    {status === 'sending' ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="card text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="font-semibold mb-2">24/7 Helpline</h3>
              <p className="text-sm text-gray-600">Call us anytime for urgent queries during tournament period</p>
            </div>
            <div className="card text-center">
              <div className="w-12 h-12 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-gold-600" />
              </div>
              <h3 className="font-semibold mb-2">Quick Response</h3>
              <p className="text-sm text-gray-600">Email responses within 24 hours on business days</p>
            </div>
            <div className="card text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Visit Office</h3>
              <p className="text-sm text-gray-600">Walk-in consultations available during office hours</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
