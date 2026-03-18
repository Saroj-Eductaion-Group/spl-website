'use client'

import { useState } from 'react'
import { Upload, File, X, CheckCircle } from 'lucide-react'

interface DocumentUploadProps {
  label: string
  required?: boolean
  accept?: string
  onChange?: (url: string | null) => void
  name: string
}

export default function DocumentUpload({ label, required = false, accept = "image/*,.pdf", onChange, name }: DocumentUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploaded, setUploaded] = useState(false)
  const [fileUrl, setFileUrl] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)

  const uploadFile = async (selectedFile: File) => {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      
      const data = await response.json()
      
      if (data.success) {
        setFileUrl(data.url)
        setUploaded(true)
        onChange?.(data.url)
      }
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleFileChange = (selectedFile: File | null) => {
    setFile(selectedFile)
    if (selectedFile) {
      uploadFile(selectedFile)
    } else {
      setUploaded(false)
      setFileUrl(null)
      onChange?.(null)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      handleFileChange(droppedFile)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null
    handleFileChange(selectedFile)
  }

  return (
    <div className="mb-4">
      <label className="form-label">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragOver ? 'border-primary-400 bg-primary-50' : uploaded ? 'border-green-400 bg-green-50' : 'border-gray-300'
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        {file ? (
          <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
            <div className="flex items-center">
              {uploaded ? (
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              ) : (
                <File className="w-5 h-5 text-gray-500 mr-2" />
              )}
              <span className="text-sm text-gray-700">{file.name}</span>
              {uploading && <span className="text-xs text-gray-500 ml-2">Uploading...</span>}
            </div>
            <button
              type="button"
              onClick={() => handleFileChange(null)}
              className="text-red-500 hover:text-red-700"
              disabled={uploading}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div>
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600 mb-2">Drop file here or click to upload</p>
            <input
              type="file"
              accept={accept}
              onChange={handleInputChange}
              className="hidden"
              id={`upload-${name}`}
              name={name}
            />
            <label
              htmlFor={`upload-${name}`}
              className="btn-primary cursor-pointer"
            >
              Choose File
            </label>
            <p className="text-xs text-gray-500 mt-2">Max size: 5MB. Formats: JPG, PNG, PDF</p>
          </div>
        )}
      </div>
    </div>
  )
}