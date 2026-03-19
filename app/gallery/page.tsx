'use client'

import { Camera, Play, Image as ImageIcon } from 'lucide-react'
import { useState } from 'react'

const photos = [
  { id: 1, title: 'Tournament Launch', category: 'Events' },
  { id: 2, title: 'Team Registration', category: 'Registration' },
  { id: 3, title: 'Practice Session', category: 'Training' },
  { id: 4, title: 'District Match', category: 'Matches' },
  { id: 5, title: 'Player Action', category: 'Matches' },
  { id: 6, title: 'Award Ceremony', category: 'Events' },
  { id: 7, title: 'Team Celebration', category: 'Matches' },
  { id: 8, title: 'Coaching Session', category: 'Training' },
]

const videos = [
  { id: 1, title: 'SPL 2025 Promo', duration: '2:30' },
  { id: 2, title: 'Best Catches Compilation', duration: '5:45' },
  { id: 3, title: 'Final Match Highlights', duration: '8:20' },
  { id: 4, title: 'Player Interviews', duration: '12:15' },
]

const categories = ['All', 'Events', 'Matches', 'Training', 'Registration']

const gradients = [
  'from-blue-500 to-blue-700',
  'from-primary-500 to-primary-700',
  'from-green-500 to-green-700',
  'from-purple-500 to-purple-700',
  'from-red-500 to-red-700',
  'from-yellow-500 to-yellow-700',
  'from-indigo-500 to-indigo-700',
  'from-teal-500 to-teal-700',
]

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState('All')

  const filtered = activeCategory === 'All'
    ? photos
    : photos.filter(p => p.category === activeCategory)

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-primary-600 mb-4">Gallery</h1>
            <p className="text-xl text-gray-600">Capturing the Spirit of SPL Tournament</p>
          </div>

          {/* Coming Soon Banner */}
          <div className="bg-primary-50 border border-primary-200 rounded-xl p-6 mb-8 text-center">
            <ImageIcon className="w-10 h-10 text-primary-400 mx-auto mb-3" />
            <h2 className="text-lg font-semibold text-primary-700 mb-1">Photos & Videos Coming Soon</h2>
            <p className="text-sm text-primary-600">Tournament media will be uploaded here during and after the event. Check back soon!</p>
          </div>

          {/* Photo Gallery */}
          <div className="card mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center">
                <Camera className="w-8 h-8 text-primary-500 mr-3" />
                <h2 className="text-2xl font-semibold text-primary-600">Photo Gallery</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      activeCategory === cat
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {filtered.map((photo, i) => (
                <div key={photo.id} className="group relative overflow-hidden rounded-lg aspect-square">
                  <div className={`w-full h-full bg-gradient-to-br ${gradients[i % gradients.length]} flex flex-col items-center justify-center`}>
                    <Camera className="w-10 h-10 text-white opacity-40 mb-2" />
                    <span className="text-white text-xs opacity-60 font-medium">Photo Coming Soon</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3">
                    <h3 className="text-white font-medium text-sm">{photo.title}</h3>
                    <p className="text-gray-300 text-xs">{photo.category}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Video Gallery */}
          <div className="card mb-8">
            <div className="flex items-center mb-6">
              <Play className="w-8 h-8 text-gold-500 mr-3" />
              <h2 className="text-2xl font-semibold text-gold-600">Video Gallery</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {videos.map((video, i) => (
                <div key={video.id} className="group cursor-pointer">
                  <div className={`relative overflow-hidden rounded-lg aspect-video mb-3 bg-gradient-to-br ${gradients[(i + 2) % gradients.length]} flex items-center justify-center`}>
                    <div className="w-14 h-14 bg-white bg-opacity-20 rounded-full flex items-center justify-center group-hover:bg-opacity-30 transition-all">
                      <Play className="w-6 h-6 text-white ml-1" />
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-0.5 rounded text-xs">
                      {video.duration}
                    </div>
                  </div>
                  <h3 className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors text-sm">{video.title}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Coming Soon</p>
                </div>
              ))}
            </div>
          </div>

          {/* Live Stream */}
          <div className="card text-center bg-gradient-to-r from-red-50 to-pink-50">
            <div className="flex items-center justify-center mb-4">
              <div className="w-3 h-3 bg-red-400 rounded-full mr-2"></div>
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
