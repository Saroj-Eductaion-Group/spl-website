'use client'

import { useEffect, useState } from 'react'
import { Bell, Calendar, User } from 'lucide-react'

interface Announcement {
  id: string
  title: string
  content: string
  type: string
  active: boolean
  createdAt: string
}

const typeColors: Record<string, string> = {
  INFO: 'bg-blue-50 border-blue-400',
  IMPORTANT: 'bg-red-50 border-red-400',
  UPDATE: 'bg-green-50 border-green-400',
}

const typeBadge: Record<string, string> = {
  INFO: 'bg-blue-100 text-blue-700',
  IMPORTANT: 'bg-red-100 text-red-700',
  UPDATE: 'bg-green-100 text-green-700',
}

const staticNews = [
  { id: 1, title: 'SPL Registration Opens', excerpt: 'Team and individual registrations are now open for Saroj Premier League Under-19 tournament.', date: '2024-02-15', author: 'SPL Committee', category: 'Registration' },
  { id: 2, title: 'Ekana Stadium Confirmed as Final Venue', excerpt: 'The grand finale of SPL will be held at the prestigious Ekana Cricket Stadium in Lucknow.', date: '2024-02-10', author: 'Tournament Director', category: 'Venue' },
  { id: 3, title: 'Prize Money ₹11 Lakhs', excerpt: 'Winner prize money is ₹11,00,000 making it the biggest U19 tournament in UP.', date: '2024-02-08', author: 'SPL Management', category: 'Prize' },
  { id: 4, title: '50% Scholarship for All Participants', excerpt: 'Every player participating in SPL will be eligible for 50% scholarship at Saroj International University.', date: '2024-02-05', author: 'Academic Partner', category: 'Scholarship' },
]

export default function News() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/announcements')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setAnnouncements(data.filter((a: Announcement) => a.active))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-primary-600 mb-4">News & Announcements</h1>
            <p className="text-xl text-gray-600">Latest Updates from SPL Tournament</p>
          </div>

          {/* Live Announcements from DB */}
          <div className="card mb-8">
            <div className="flex items-center mb-6">
              <Bell className="w-8 h-8 text-red-500 mr-3" />
              <h2 className="text-2xl font-semibold text-red-600">Official Announcements</h2>
            </div>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
              </div>
            ) : announcements.length > 0 ? (
              <div className="space-y-4">
                {announcements.map(ann => (
                  <div key={ann.id} className={`p-4 rounded-lg border-l-4 ${typeColors[ann.type] || 'bg-gray-50 border-gray-400'}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{ann.title}</h3>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${typeBadge[ann.type] || 'bg-gray-100 text-gray-600'}`}>{ann.type}</span>
                        </div>
                        <p className="text-gray-600 text-sm">{ann.content}</p>
                      </div>
                      <span className="text-xs text-gray-500 ml-4 whitespace-nowrap">{new Date(ann.createdAt).toLocaleDateString('en-IN')}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No announcements at this time. Check back soon.</p>
            )}
          </div>

          {/* Static News Articles */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {staticNews.slice(0, 2).map(item => (
              <div key={item.id} className="card">
                <div className="h-40 bg-gradient-to-r from-primary-400 to-primary-600 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-white text-lg font-semibold">SPL NEWS</span>
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="bg-primary-100 text-primary-600 px-3 py-1 rounded-full text-sm">{item.category}</span>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(item.date).toLocaleDateString('en-IN')}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-600 mb-3">{item.excerpt}</p>
                <div className="flex items-center text-gray-500 text-sm">
                  <User className="w-4 h-4 mr-1" />
                  {item.author}
                </div>
              </div>
            ))}
          </div>

          <div className="card">
            <h2 className="text-2xl font-semibold mb-6 text-primary-600">Latest News</h2>
            <div className="space-y-6">
              {staticNews.map(item => (
                <div key={item.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                    <span className="bg-primary-100 text-primary-600 px-3 py-1 rounded-full text-sm w-fit mb-2 md:mb-0">{item.category}</span>
                    <div className="flex items-center gap-4 text-gray-500 text-sm">
                      <div className="flex items-center"><Calendar className="w-4 h-4 mr-1" />{new Date(item.date).toLocaleDateString('en-IN')}</div>
                      <div className="flex items-center"><User className="w-4 h-4 mr-1" />{item.author}</div>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                  <p className="text-gray-600">{item.excerpt}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
