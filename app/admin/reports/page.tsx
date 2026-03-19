'use client'

import { useState } from 'react'
import { Download, FileText, Users, CreditCard, Trophy } from 'lucide-react'

export default function AdminReports() {
  const [loading, setLoading] = useState<string | null>(null)

  const downloadReport = async (type: string, format: 'csv' | 'pdf') => {
    const key = `${type}-${format}`
    setLoading(key)
    try {
      const token = localStorage.getItem('adminToken') || ''
      const response = await fetch(`/api/admin/reports?type=${type}&format=${format}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!response.ok) throw new Error((await response.json()).error || 'Download failed')
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      if (format === 'pdf') {
        // Open HTML in new tab so user can Ctrl+P to print/save as PDF
        window.open(url, '_blank')
      } else {
        const a = document.createElement('a')
        a.href = url
        a.download = `SPL_${type}_${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      }
      window.URL.revokeObjectURL(url)
    } catch (error) {
      alert(`Failed to download: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(null)
    }
  }

  const reports = [
    { id: 'teams', title: 'Teams Report', description: 'All team registrations with district, status, player count', icon: FileText, color: 'primary' },
    { id: 'players', title: 'Players Report', description: 'All player registrations with document links', icon: Users, color: 'green' },
    { id: 'payments', title: 'Payments Report', description: 'All payment transactions and statuses', icon: CreditCard, color: 'purple' },
    { id: 'individual', title: 'Individual Players', description: 'Unassigned individual players district-wise', icon: Users, color: 'orange' },
    { id: 'matches', title: 'Match Results', description: 'All fixtures, scores and match results', icon: Trophy, color: 'green' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary-600">Reports & Export</h1>
        <p className="text-gray-600">Download tournament data in CSV or PDF format</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map(report => (
          <div key={report.id} className="card">
            <div className="flex items-start space-x-4 mb-4">
              <div className={`p-3 rounded-lg bg-${report.color}-100`}>
                <report.icon className={`w-6 h-6 text-${report.color}-600`} />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">{report.title}</h3>
                <p className="text-sm text-gray-600">{report.description}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => downloadReport(report.id, 'csv')}
                disabled={loading === `${report.id}-csv`}
                className="flex-1 btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 text-sm py-2"
              >
                <Download className="w-4 h-4" />
                <span>{loading === `${report.id}-csv` ? '...' : 'CSV'}</span>
              </button>
              <button
                onClick={() => downloadReport(report.id, 'pdf')}
                disabled={loading === `${report.id}-pdf`}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center justify-center space-x-2 disabled:opacity-50 text-sm py-2 font-semibold"
              >
                <Download className="w-4 h-4" />
                <span>{loading === `${report.id}-pdf` ? '...' : 'PDF'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 card">
        <h3 className="text-lg font-semibold mb-4">Notes</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• CSV files can be opened directly in Microsoft Excel or Google Sheets</li>
          <li>• PDF files are formatted for printing and sharing</li>
          <li>• All data reflects current database records at time of download</li>
          <li>• Player reports include document URLs for verification</li>
        </ul>
      </div>
    </div>
  )
}
