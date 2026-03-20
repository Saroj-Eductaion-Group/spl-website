'use client'

import { useState } from 'react'

const reports = [
  { id: 'teams',      title: 'Teams Report',        desc: 'All team registrations with district, status, player count', icon: 'description'   },
  { id: 'players',    title: 'Players Report',       desc: 'All player registrations with document links',              icon: 'groups'        },
  { id: 'payments',   title: 'Payments Report',      desc: 'All payment transactions and statuses',                     icon: 'payments'      },
  { id: 'individual', title: 'Individual Players',   desc: 'Unassigned individual players district-wise',               icon: 'person_search' },
  { id: 'matches',    title: 'Match Results',        desc: 'All fixtures, scores and match results',                    icon: 'emoji_events'  },
]

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

  const isLoading = (id: string, fmt: string) => loading === `${id}-${fmt}`

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-headline font-black text-3xl italic uppercase tracking-tighter text-[#e4e1e9]">Reports & <span className="text-[#ffd700]">Export</span></h1>
        <p className="text-[#c4c6d0]/60 text-sm mt-1">Download tournament data in Excel, CSV or PDF format</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.map(report => (
          <div key={report.id} className="bg-[#131318] border border-[#444650]/20 p-5 hover:border-[#ffd700]/20 transition-colors">
            <div className="flex items-start gap-4 mb-5">
              <div className="w-10 h-10 bg-[#ffd700]/10 border border-[#ffd700]/20 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[#ffd700]" style={{ fontSize: '20px' }}>{report.icon}</span>
              </div>
              <div>
                <h3 className="font-headline font-black text-sm uppercase tracking-tight text-[#e4e1e9] mb-1">{report.title}</h3>
                <p className="text-xs text-[#c4c6d0]/60 font-body leading-relaxed">{report.desc}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => downloadReport(report.id, 'xlsx')} disabled={!!loading}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 text-xs font-headline font-black uppercase tracking-tight flex items-center justify-center gap-1.5 disabled:opacity-50 transition-colors">
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>table_chart</span>
                {isLoading(report.id, 'xlsx') ? '...' : 'Excel'}
              </button>
              <button onClick={() => downloadReport(report.id, 'csv')} disabled={!!loading}
                className="flex-1 bg-[#002366] hover:bg-[#002d80] text-[#ffd700] border border-[#ffd700]/30 py-2 text-xs font-headline font-black uppercase tracking-tight flex items-center justify-center gap-1.5 disabled:opacity-50 transition-colors">
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>download</span>
                {isLoading(report.id, 'csv') ? '...' : 'CSV'}
              </button>
              <button onClick={() => downloadReport(report.id, 'pdf')} disabled={!!loading}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 text-xs font-headline font-black uppercase tracking-tight flex items-center justify-center gap-1.5 disabled:opacity-50 transition-colors">
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>picture_as_pdf</span>
                {isLoading(report.id, 'pdf') ? '...' : 'PDF'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-[#131318] border border-[#444650]/20 p-5">
        <h3 className="font-headline font-bold uppercase tracking-tight text-[#e4e1e9] mb-4 text-sm">Export Guide</h3>
        <ul className="space-y-2 text-sm text-[#c4c6d0]">
          {[
            { label: 'Excel', cls: 'text-emerald-400 border-emerald-400/30', desc: 'Opens directly in Microsoft Excel / Google Sheets with proper formatting' },
            { label: 'CSV',   cls: 'text-[#ffd700] border-[#ffd700]/30',     desc: 'Universal format compatible with all spreadsheet applications' },
            { label: 'PDF',   cls: 'text-red-400 border-red-400/30',         desc: 'Downloads as HTML file — open in browser and press Ctrl+P → Save as PDF' },
          ].map(item => (
            <li key={item.label} className="flex items-center gap-3">
              <span className={`text-[0.6rem] font-headline font-bold uppercase tracking-widest border px-2 py-0.5 w-14 text-center flex-shrink-0 ${item.cls}`}>{item.label}</span>
              <span className="text-[#c4c6d0]/70">{item.desc}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
