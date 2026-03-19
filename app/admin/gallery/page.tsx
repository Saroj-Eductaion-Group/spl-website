'use client'

import { useEffect, useState } from 'react'
import { Trash2, Eye, EyeOff, Plus, Upload, X, Image as ImageIcon, Play } from 'lucide-react'

interface GalleryItem {
  id: string; title: string; url: string; category: string; type: string; active: boolean; createdAt: string
}

const CATEGORIES = ['General', 'Events', 'Matches', 'Training', 'Registration']

export default function AdminGallery() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState({ title: '', url: '', category: 'General', type: 'photo' })
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [filter, setFilter] = useState('ALL')

  const token = () => localStorage.getItem('adminToken') || ''

  const load = async () => {
    const data = await fetch('/api/admin/gallery', { headers: { Authorization: `Bearer ${token()}` } }).then(r => r.json())
    if (Array.isArray(data)) setItems(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleFileUpload = async (file: File) => {
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.success) setForm(prev => ({ ...prev, url: data.url }))
      else alert('Upload failed')
    } catch { alert('Upload failed') }
    finally { setUploading(false) }
  }

  const handleAdd = async () => {
    if (!form.title || !form.url) return alert('Title and image/URL are required')
    await fetch('/api/admin/gallery', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
      body: JSON.stringify(form)
    })
    setForm({ title: '', url: '', category: 'General', type: 'photo' })
    setUploadFile(null)
    setShowForm(false)
    load()
  }

  const toggleActive = async (id: string, active: boolean) => {
    await fetch('/api/admin/gallery', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
      body: JSON.stringify({ id, active: !active })
    })
    load()
  }

  const deleteItem = async (id: string) => {
    if (!confirm('Delete this item?')) return
    await fetch('/api/admin/gallery', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
      body: JSON.stringify({ id })
    })
    load()
  }

  const filtered = filter === 'ALL' ? items : items.filter(i => i.category === filter)

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div></div>

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary-600">Gallery Management</h1>
          <p className="text-gray-600">Upload and manage tournament photos & videos</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Media
        </button>
      </div>

      {/* Add Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-bold text-primary-600">Add Gallery Item</h2>
              <button onClick={() => { setShowForm(false); setForm({ title: '', url: '', category: 'General', type: 'photo' }); setUploadFile(null) }}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="form-label">Title *</label>
                <input className="form-input" placeholder="e.g. District Match Day 1" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Category</label>
                  <select className="form-input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Type</label>
                  <select className="form-input" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                    <option value="photo">Photo</option>
                    <option value="video">Video</option>
                  </select>
                </div>
              </div>

              {/* Upload or URL */}
              <div>
                <label className="form-label">Upload Image / Enter URL *</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center mb-2">
                  <input
                    type="file"
                    accept="image/*,video/*"
                    id="gallery-upload"
                    className="hidden"
                    onChange={e => {
                      const f = e.target.files?.[0]
                      if (f) { setUploadFile(f); handleFileUpload(f) }
                    }}
                  />
                  <label htmlFor="gallery-upload" className="cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">{uploading ? 'Uploading...' : uploadFile ? uploadFile.name : 'Click to upload file'}</p>
                  </label>
                </div>
                <p className="text-xs text-gray-400 text-center mb-2">— OR enter URL directly —</p>
                <input
                  className="form-input"
                  placeholder="https://... or /uploads/..."
                  value={form.url}
                  onChange={e => setForm({ ...form, url: e.target.value })}
                />
                {form.url && form.type === 'photo' && (
                  <img src={form.url} alt="preview" className="mt-2 h-24 w-full object-cover rounded-lg" onError={e => (e.currentTarget.style.display = 'none')} />
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={handleAdd} disabled={uploading || !form.title || !form.url} className="btn-primary flex-1 disabled:opacity-50">
                  Add to Gallery
                </button>
                <button onClick={() => { setShowForm(false); setForm({ title: '', url: '', category: 'General', type: 'photo' }); setUploadFile(null) }} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex-1">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="card text-center py-4"><p className="text-2xl font-bold text-primary-600">{items.length}</p><p className="text-sm text-gray-500">Total Items</p></div>
        <div className="card text-center py-4"><p className="text-2xl font-bold text-green-600">{items.filter(i => i.active).length}</p><p className="text-sm text-gray-500">Visible</p></div>
        <div className="card text-center py-4"><p className="text-2xl font-bold text-gray-400">{items.filter(i => !i.active).length}</p><p className="text-sm text-gray-500">Hidden</p></div>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['ALL', ...CATEGORIES].map(c => (
          <button key={c} onClick={() => setFilter(c)} className={`px-3 py-1.5 rounded-lg text-sm font-medium ${filter === c ? 'bg-primary-500 text-white' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'}`}>
            {c} ({c === 'ALL' ? items.length : items.filter(i => i.category === c).length})
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="card text-center py-16 text-gray-400">
          <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p>No gallery items yet. Click "Add Media" to upload photos.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map(item => (
            <div key={item.id} className={`relative rounded-xl overflow-hidden border-2 ${item.active ? 'border-gray-200' : 'border-gray-100 opacity-60'}`}>
              <div className="aspect-square bg-gray-100 relative">
                {item.type === 'photo' ? (
                  <img src={item.url} alt={item.title} className="w-full h-full object-cover" onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-800">
                    <Play className="w-10 h-10 text-white opacity-60" />
                  </div>
                )}
                {!item.active && (
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <span className="text-white text-xs font-semibold bg-black bg-opacity-60 px-2 py-1 rounded">Hidden</span>
                  </div>
                )}
              </div>
              <div className="p-3 bg-white">
                <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                <p className="text-xs text-gray-500 mb-2">{item.category} • {item.type}</p>
                <div className="flex gap-2">
                  <button onClick={() => toggleActive(item.id, item.active)} className={`flex-1 flex items-center justify-center gap-1 text-xs py-1.5 rounded-lg font-medium ${item.active ? 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100' : 'bg-green-50 text-green-700 hover:bg-green-100'}`}>
                    {item.active ? <><EyeOff className="w-3 h-3" /> Hide</> : <><Eye className="w-3 h-3" /> Show</>}
                  </button>
                  <button onClick={() => deleteItem(item.id)} className="flex items-center justify-center gap-1 text-xs py-1.5 px-3 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-medium">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
