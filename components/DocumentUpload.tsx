'use client'

import { useState } from 'react'
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react'

interface DocumentUploadProps {
  label: string
  required?: boolean
  accept?: string
  onChange?: (url: string | null) => void
  name: string
}

const MAX_SIZE_MB = 5

export default function DocumentUpload({ label, required = false, accept = 'image/*,.pdf', onChange, name }: DocumentUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploaded, setUploaded] = useState(false)
  const [error, setError] = useState('')
  const [dragOver, setDragOver] = useState(false)

  const uploadFile = async (selectedFile: File) => {
    if (selectedFile.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`File too large. Max size is ${MAX_SIZE_MB}MB.`)
      return
    }
    setError('')
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.success) {
        setUploaded(true)
        onChange?.(data.url)
      } else {
        setError('Upload failed. Please try again.')
      }
    } catch {
      setError('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleFile = (f: File | null) => {
    setFile(f)
    setUploaded(false)
    setError('')
    if (f) uploadFile(f)
    else onChange?.(null)
  }

  return (
    <div className="mb-4">
      <label className="form-label">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div
        className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors cursor-pointer ${
          dragOver ? 'border-primary-400 bg-primary-50' :
          uploaded ? 'border-green-400 bg-green-50' :
          error ? 'border-red-400 bg-red-50' :
          'border-gray-300 hover:border-primary-300'
        }`}
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }}
      >
        {file ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              {uploaded ? <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" /> :
               error ? <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" /> :
               <File className="w-5 h-5 text-gray-400 flex-shrink-0" />}
              <span className="text-sm text-gray-700 truncate">{file.name}</span>
              {uploading && <span className="text-xs text-primary-500 flex-shrink-0">Uploading...</span>}
              {uploaded && <span className="text-xs text-green-600 flex-shrink-0">✓ Uploaded</span>}
            </div>
            <button type="button" onClick={() => handleFile(null)} disabled={uploading} className="text-red-400 hover:text-red-600 ml-2 flex-shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
            <Upload className="w-7 h-7 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500 mb-2">Drop file here or</p>
            <input type="file" accept={accept} onChange={e => handleFile(e.target.files?.[0] || null)} className="hidden" id={`upload-${name}`} />
            <label htmlFor={`upload-${name}`} className="btn-primary text-sm py-1.5 px-4 cursor-pointer">
              Choose File
            </label>
            <p className="text-xs text-gray-400 mt-2">JPG, PNG, PDF — Max {MAX_SIZE_MB}MB</p>
          </>
        )}
      </div>
      {error && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{error}</p>}
    </div>
  )
}
