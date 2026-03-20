'use client'

import { useState, useEffect } from 'react'

interface GalleryItem { id: string; title: string; url: string; category: string; type: string; active: boolean }

const CATEGORIES = ['All', 'Events', 'Matches', 'Training', 'Registration', 'General']

export default function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null)

  useEffect(() => {
    fetch('/api/admin/gallery').then(r => r.json())
      .then(data => { if (Array.isArray(data)) setItems(data.filter((i: GalleryItem) => i.active)) })
      .catch(() => {}).finally(() => setLoading(false))
  }, [])

  const photos = items.filter(i => i.type === 'photo')
  const videos = items.filter(i => i.type === 'video')
  const filtered = activeCategory === 'All' ? photos : photos.filter(p => p.category === activeCategory)

  return (
    <div className="min-h-screen bg-[#0b0b0f] text-[#e4e1e9] pt-20">

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4" onClick={() => setLightbox(null)}>
          <div className="max-w-4xl w-full" onClick={e => e.stopPropagation()}>
            <img src={lightbox.url} alt={lightbox.title} className="w-full max-h-[80vh] object-contain" />
            <p className="text-[#e4e1e9] text-center mt-4 font-headline font-bold uppercase">{lightbox.title}</p>
            <button onClick={() => setLightbox(null)} className="absolute top-6 right-6 text-[#e4e1e9] text-4xl leading-none hover:text-[#ffd700]">&times;</button>
          </div>
        </div>
      )}

      {/* Hero */}
      <section className="spl-hero border-b border-[#ffd700]/15">
        <div className="max-w-screen-xl mx-auto relative z-10">
          <p className="text-[#ffd700] font-headline font-bold text-xs tracking-[0.3em] uppercase mb-4">Media</p>
          <h1 className="font-headline font-black text-5xl md:text-7xl italic uppercase tracking-tighter leading-[0.9] mb-6 text-white">
            SPL <br /><span className="text-[#ffd700]">GALLERY</span>
          </h1>
          <p className="text-white/70 text-lg max-w-2xl">Capturing the spirit of SPL Tournament</p>
        </div>
      </section>

      {/* Photos */}
      <section className="py-16 px-6">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
            <div>
              <div className="w-24 h-1 bg-[#ffd700] mb-4" />
              <h2 className="font-headline font-black text-3xl uppercase tracking-tighter italic">Photo Gallery <span className="text-[#c4c6d0]/40 text-xl">({photos.length})</span></h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.filter(c => c === 'All' || photos.some(p => p.category === c)).map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 text-xs font-headline font-black uppercase tracking-widest transition-all ${activeCategory === cat ? 'bg-[#ffd700] text-[#002366]' : 'border border-[#444650]/40 text-[#c4c6d0] hover:border-[#ffd700] hover:text-[#ffd700]'}`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-2 border-[#ffd700] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-2">
              {filtered.map(item => (
                <div key={item.id} className="group relative overflow-hidden aspect-square cursor-pointer border border-[#444650]/10 hover:border-[#ffd700]/40 transition-colors" onClick={() => setLightbox(item)}>
                  <img src={item.url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 grayscale group-hover:grayscale-0" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0f] to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                    <h3 className="text-white font-headline font-bold uppercase text-sm">{item.title}</h3>
                    <p className="text-[#ffd700] text-xs font-headline">{item.category}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-2">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-square bg-[#131318] border border-[#444650]/10 flex flex-col items-center justify-center">
                  <span className="text-4xl opacity-20">📷</span>
                  <span className="text-[#c4c6d0]/30 text-xs font-headline uppercase mt-2">Coming Soon</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Videos */}
      {videos.length > 0 && (
        <section className="py-16 px-6 bg-[#131318] border-y border-[#444650]/15">
          <div className="max-w-screen-xl mx-auto">
            <div className="w-24 h-1 bg-[#ffd700] mb-4" />
            <h2 className="font-headline font-black text-3xl uppercase tracking-tighter italic mb-10">Video Gallery <span className="text-[#c4c6d0]/40 text-xl">({videos.length})</span></h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {videos.map(video => (
                <a key={video.id} href={video.url} target="_blank" rel="noopener noreferrer" className="group">
                  <div className="aspect-video bg-[#0b0b0f] border border-[#444650]/20 flex items-center justify-center mb-3 hover:border-[#ffd700]/40 transition-colors">
                    <div className="w-14 h-14 border-2 border-[#ffd700]/40 rounded-full flex items-center justify-center group-hover:border-[#ffd700] group-hover:bg-[#ffd700]/10 transition-all">
                      <span className="text-[#ffd700] text-xl ml-1">▶</span>
                    </div>
                  </div>
                  <h3 className="font-headline font-bold uppercase text-sm group-hover:text-[#ffd700] transition-colors">{video.title}</h3>
                  <p className="text-xs text-[#c4c6d0]/50 mt-0.5">{video.category}</p>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Live Stream */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <h2 className="font-headline font-black text-3xl uppercase tracking-tighter italic">Live Stream</h2>
          </div>
          <div className="bg-[#131318] border border-[#444650]/20 aspect-video flex items-center justify-center">
            <div className="text-center">
              <div className="text-5xl mb-4 opacity-20">▶</div>
              <p className="font-headline font-bold uppercase tracking-widest text-[#c4c6d0]">Live Stream During Tournament</p>
              <p className="text-[#c4c6d0]/50 text-sm mt-2">Stay tuned for schedule updates</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
