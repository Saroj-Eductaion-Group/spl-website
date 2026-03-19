'use client'

import { Camera, Play, Image as ImageIcon } from 'lucide-react'
import { useState, useEffect } from 'react'

interface GalleryItem {
  id: string; title: string; url: string; category: string; type: string; active: boolean
}

const CATEGORIES = ['All', 'Events', 'Matches', 'Training', 'Registration', 'General']

const gradients = [
  'from-blue-500 to-blue-700', 'from-primary-500 to-primary-700',
  'from-green-500 to-green-700', 'from-purple-500 to-purple-700',
  'from-red-500 to-red-700', 'from-yellow-500 to-yellow-700',
  'from-indigo-500 to-indigo-700', 'from-teal-500 to-teal-700',
]

export default function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null)

  useEffect(() => {
    fetch('/api/admin/gallery')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setItems(data.filter((i: GalleryItem) => i.active)) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const photos = items.filter(i => i.type === 'photo')
  const videos = items.filter(i => i.type === 'video')
  const filtered = activeCategory === 'All' ? photos : photos.filter(p => p.category === activeCategory)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="page-hero">
        <div className="container mx-auto px-4 text-center">
          <h1 className="page-hero-title">Gallery</h1>
          <p className="page-hero-sub">Capturing the Spirit of SPL Tournament</p>
        </div>
      </div>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">

          {/* Lightbox */}
          {lightbox && (
            <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4" onClick={() => setLightbox(null)}>
              <div className="max-w-4xl w-full" onClick={e => e.stopPropagation()}>
                <img src={lightbox.url} alt={lightbox.title} className="w-full max-h-[80vh] object-contain rounded-lg" />
                <p className="text-white text-center mt-3 font-medium">{lightbox.title}</p>
                <button onClick={() => setLightbox(null)} className="absolute top-4 right-4 text-white text-3xl leading-none">&times;</button>
              </div>
            </div>
          )}

          {items.length === 0 && !loading && (
            <div className="bg-primary-50 border border-primary-200 rounded-xl p-6 mb-8 text-center">
              <ImageIcon className="w-10 h-10 text-primary-400 mx-auto mb-3" />
              <h2 className="text-lg font-semibold text-primary-700 mb-1">Photos & Videos Coming Soon</h2>
              <p className="text-sm text-primary-600">Tournament media will be uploaded here during and after the event.</p>
            </div>
          )}

          {/* Photo Gallery */}
          <div className="card mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center">
                <Camera className="w-8 h-8 text-primary-500 mr-3" />
                <h2 className="text-2xl font-semibold text-primary-600">Photo Gallery</h2>
                <span className="ml-2 text-sm text-gray-500">({photos.length})</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.filter(c => c === 'All' || photos.some(p => p.category === c)).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${activeCategory === cat ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500"></div></div>
            ) : filtered.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {filtered.map((item, i) => (
                  <div key={item.id} className="group relative overflow-hidden rounded-lg aspect-square cursor-pointer" onClick={() => setLightbox(item)}>
                    <img
                      src={item.url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={e => {
                        const el = e.currentTarget
                        el.style.display = 'none'
                        el.nextElementSibling?.classList.remove('hidden')
                      }}
                    />
                    <div className={`hidden w-full h-full bg-gradient-to-br ${gradients[i % gradients.length]} flex flex-col items-center justify-center absolute inset-0`}>
                      <Camera className="w-10 h-10 text-white opacity-40 mb-2" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <h3 className="text-white font-medium text-sm">{item.title}</h3>
                      <p className="text-gray-300 text-xs">{item.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className={`relative overflow-hidden rounded-lg aspect-square bg-gradient-to-br ${gradients[i % gradients.length]} flex flex-col items-center justify-center`}>
                    <Camera className="w-10 h-10 text-white opacity-30 mb-2" />
                    <span className="text-white text-xs opacity-50">Coming Soon</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Video Gallery */}
          {videos.length > 0 && (
            <div className="card mb-8">
              <div className="flex items-center mb-6">
                <Play className="w-8 h-8 text-gold-500 mr-3" />
                <h2 className="text-2xl font-semibold text-gold-600">Video Gallery</h2>
                <span className="ml-2 text-sm text-gray-500">({videos.length})</span>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {videos.map((video, i) => (
                  <a key={video.id} href={video.url} target="_blank" rel="noopener noreferrer" className="group cursor-pointer">
                    <div className={`relative overflow-hidden rounded-lg aspect-video mb-3 bg-gradient-to-br ${gradients[(i + 2) % gradients.length]} flex items-center justify-center`}>
                      <div className="w-14 h-14 bg-white bg-opacity-20 rounded-full flex items-center justify-center group-hover:bg-opacity-30 transition-all">
                        <Play className="w-6 h-6 text-white ml-1" />
                      </div>
                    </div>
                    <h3 className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors text-sm">{video.title}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">{video.category}</p>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Live Stream placeholder */}
          <div className="card text-center bg-gradient-to-r from-red-50 to-pink-50">
            <div className="flex items-center justify-center mb-4">
              <div className="w-3 h-3 bg-red-400 rounded-full mr-2 animate-pulse"></div>
              <h2 className="text-2xl font-semibold text-red-600">Live Stream</h2>
            </div>
            <p className="text-gray-600 mb-4">Watch SPL matches live during the tournament period</p>
            <div className="bg-white p-8 rounded-lg max-w-2xl mx-auto">
              <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
                <div className="text-center text-white">
                  <Play className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p className="text-lg">Live Stream Will Start During Tournament</p>
                  <p className="text-sm opacity-60 mt-1">Stay tuned for schedule updates</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
