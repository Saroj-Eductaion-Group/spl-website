'use client'

import { useState } from 'react'
import { Download, FileText, Users, CreditCard, Trophy, FileSpreadsheet } from 'lucide-react'

export default function AdminReports() {
  const [loading, setLoading] = useState<string | null>(null)

  const downloadReport = async (type: string, format: 'xlsx' | 'csv' | 'pdf') => {
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
      const a = document.createElement('a')
      a.href = url
      const date = new Date().toISOString().split('T')[0]
      a.download = `SPL_${type}_${date}.${format === 'pdf' ? 'html' : format}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
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

  const isLoading = (id: string, fmt: string) => loading === `${id}-${fmt}`

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary-600">Reports & Export</h1>
        <p className="text-gray-600">Download tournament data in Excel, CSV or PDF format</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map(report => (
          <div key={report.id} className="card">
            <div className="flex items-start space-x-4 mb-5">
              <div className={`p-3 rounded-lg bg-${report.color}-100`}>
                <report.icon className={`w-6 h-6 text-${report.color}-600`} />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">{report.title}</h3>
                <p className="text-sm text-gray-600">{report.description}</p>
              </div>
            </div>
            <div className="flex gap-2">
              {/* Excel */}
              <button
                onClick={() => downloadReport(report.id, 'xlsx')}
                disabled={!!loading}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center justify-center gap-1.5 disabled:opacity-50 text-sm py-2 font-semibold"
                title="Download Excel"
              >
                <FileSpreadsheet className="w-4 h-4" />
                {isLoading(report.id, 'xlsx') ? '...' : 'Excel'}
              </button>
              {/* CSV */}
              <button
                onClick={() => downloadReport(report.id, 'csv')}
                disabled={!!loading}
                className="flex-1 btn-primary flex items-center justify-center gap-1.5 disabled:opacity-50 text-sm py-2"
                title="Download CSV"
              >
                <Download className="w-4 h-4" />
                {isLoading(report.id, 'csv') ? '...' : 'CSV'}
              </button>
              {/* PDF */}
              <button
                onClick={() => downloadReport(report.id, 'pdf')}
                disabled={!!loading}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center justify-center gap-1.5 disabled:opacity-50 text-sm py-2 font-semibold"
                title="Print / Save as PDF"
              >
                <FileText className="w-4 h-4" />
                {isLoading(report.id, 'pdf') ? '...' : 'PDF'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 card">
        <h3 className="text-lg font-semibold mb-4">Export Guide</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-center gap-2"><span className="w-16 text-center bg-green-100 text-green-700 px-2 py-0.5 rounded font-semibold text-xs">Excel</span> Opens directly in Microsoft Excel / Google Sheets with proper formatting</li>
          <li className="flex items-center gap-2"><span className="w-16 text-center bg-primary-100 text-primary-700 px-2 py-0.5 rounded font-semibold text-xs">CSV</span> Universal format compatible with all spreadsheet applications</li>
          <li className="flex items-center gap-2"><span className="w-16 text-center bg-red-100 text-red-700 px-2 py-0.5 rounded font-semibold text-xs">PDF</span> Downloads as HTML file — open it in browser and press Ctrl+P → Save as PDF</li>
        </ul>
      </div>
    </div>
  )
}
