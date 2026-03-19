import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdminToken } from '@/lib/auth'
import * as XLSX from 'xlsx'

export async function GET(req: NextRequest) {
  if (!verifyAdminToken(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type')
  const format = searchParams.get('format') || 'xlsx'

  if (!type) return NextResponse.json({ error: 'Report type required' }, { status: 400 })

  try {
    let rows: Record<string, unknown>[] = []
    const sheetName = type

    if (type === 'teams') {
      const teams = await prisma.team.findMany({ include: { _count: { select: { players: true } } } })
      rows = teams.map(t => ({
        'Registration ID': t.registrationId,
        'Team Name': t.name,
        'District': t.district,
        'School/College': t.schoolCollege,
        'Status': t.status,
        'Players': t._count.players,
        'Contact Email': t.contactEmail || '',
        'Contact Phone': t.contactPhone || '',
        'Registered On': new Date(t.createdAt).toLocaleDateString('en-IN')
      }))
    } else if (type === 'players') {
      const players = await prisma.player.findMany()
      rows = players.map(p => ({
        'Name': p.name,
        'Father Name': p.fatherName || '',
        'DOB': new Date(p.dateOfBirth).toLocaleDateString('en-IN'),
        'Phone': p.phone,
        'District': p.district,
        'School/College': p.schoolCollege,
        'Role': p.role,
        'Position': p.position || '',
        'Type': p.isIndividual ? 'Individual' : 'Team Player',
        'Team Assigned': p.teamAssigned ? 'Yes' : 'No',
        'Registered On': new Date(p.createdAt).toLocaleDateString('en-IN')
      }))
    } else if (type === 'payments') {
      const payments = await prisma.payment.findMany({ include: { team: true } })
      rows = payments.map(p => ({
        'Transaction ID': p.transactionId || '',
        'Team Name': p.team?.name || 'N/A',
        'Amount (₹)': p.amount,
        'Status': p.status,
        'Payment ID': p.paymentId || '',
        'Date': new Date(p.createdAt).toLocaleDateString('en-IN')
      }))
    } else if (type === 'individual') {
      const players = await prisma.player.findMany({ where: { isIndividual: true, teamAssigned: false } })
      rows = players.map(p => ({
        'Name': p.name,
        'Father Name': p.fatherName || '',
        'Phone': p.phone,
        'District': p.district,
        'School/College': p.schoolCollege,
        'Role': p.role,
        'Position': p.position || '',
        'Experience': p.experience || '',
        'Registered On': new Date(p.createdAt).toLocaleDateString('en-IN')
      }))
    } else if (type === 'matches') {
      const matches = await prisma.match.findMany({
        include: {
          team1: { select: { name: true, district: true } },
          team2: { select: { name: true, district: true } }
        }
      })
      rows = matches.map(m => ({
        'Phase': m.phase,
        'Team 1': m.team1.name,
        'Team 2': m.team2?.name || 'TBD',
        'Venue': m.venue,
        'Date': new Date(m.date).toLocaleDateString('en-IN'),
        'Score 1': m.score1 || '',
        'Score 2': m.score2 || '',
        'Winner': m.winner || '',
        'Result': m.result || ''
      }))
    } else {
      return NextResponse.json({ error: 'Invalid report type' }, { status: 400 })
    }

    const date = new Date().toISOString().split('T')[0]

    if (format === 'pdf') {
      const headers = Object.keys(rows[0] || {})
      const tableRows = rows.map(row =>
        `<tr>${headers.map(h => `<td>${String(row[h] ?? '')}</td>`).join('')}</tr>`
      ).join('')
      const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
<title>SPL ${type} Report</title>
<style>
  body { font-family: Arial, sans-serif; font-size: 11px; margin: 20px; }
  h2 { color: #DAA737; margin-bottom: 4px; }
  p { color: #666; margin-bottom: 16px; font-size: 10px; }
  table { width: 100%; border-collapse: collapse; }
  th { background: #1e3a5f; color: white; padding: 8px 6px; text-align: left; font-size: 10px; }
  td { padding: 6px; border-bottom: 1px solid #eee; font-size: 10px; }
  tr:nth-child(even) { background: #f9f9f9; }
  @media print { body { margin: 0; } @page { margin: 15mm; } }
</style></head><body>
<h2>SPL – ${type.toUpperCase()} REPORT</h2>
<p>Generated: ${new Date().toLocaleString('en-IN')} | Total Records: ${rows.length}</p>
<table><thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>
<tbody>${tableRows}</tbody></table>
<script>window.onload=function(){window.print()}</` + `script>
</body></html>`
      return new NextResponse(html, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      })
    }

    if (format === 'csv') {
      if (rows.length === 0) {
        return new NextResponse('No data found', {
          headers: { 'Content-Type': 'text/csv', 'Content-Disposition': `attachment; filename="SPL_${type}_${date}.csv"` }
        })
      }
      const headers = Object.keys(rows[0])
      const csv = [
        headers.join(','),
        ...rows.map(row => headers.map(h => `"${String(row[h] ?? '').replace(/"/g, '""')}"`).join(','))
      ].join('\n')
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="SPL_${type}_${date}.csv"`
        }
      })
    }

    // Default: real Excel .xlsx
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(rows.length > 0 ? rows : [{ 'No Data': 'No records found' }])
    // Auto column widths
    if (rows.length > 0) {
      const headers = Object.keys(rows[0])
      ws['!cols'] = headers.map(h => ({ wch: Math.max(h.length, ...rows.map(r => String(r[h] ?? '').length), 10) + 2 }))
    }
    XLSX.utils.book_append_sheet(wb, ws, sheetName.toUpperCase())
    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })
    return new NextResponse(buf, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="SPL_${type}_${date}.xlsx"`
      }
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate report', details: error instanceof Error ? error.message : 'Unknown' }, { status: 500 })
  }
}
