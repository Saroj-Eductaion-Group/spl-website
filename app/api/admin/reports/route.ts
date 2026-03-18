import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdminToken } from '@/lib/auth'
import * as XLSX from 'xlsx'

export async function GET(req: NextRequest) {
  if (!verifyAdminToken(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type')
  const format = searchParams.get('format') || 'csv'

  if (!type) return NextResponse.json({ error: 'Report type required' }, { status: 400 })

  try {
    let rows: Record<string, unknown>[] = []
    let sheetName = type

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

    if (format === 'pdf') {
      // Generate PDF-like HTML rendered as a downloadable HTML file (print-ready)
      // Using xlsx to create a proper Excel file which opens in Excel/Sheets
      const wb = XLSX.utils.book_new()
      const ws = XLSX.utils.json_to_sheet(rows)
      // Auto column widths
      const colWidths = Object.keys(rows[0] || {}).map(k => ({ wch: Math.max(k.length, 15) }))
      ws['!cols'] = colWidths
      XLSX.utils.book_append_sheet(wb, ws, sheetName)
      const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })
      return new NextResponse(buf, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': `attachment; filename="SPL_${type}_report.xlsx"`
        }
      })
    }

    // CSV format
    if (rows.length === 0) {
      return new NextResponse('No data found', {
        headers: { 'Content-Type': 'text/csv', 'Content-Disposition': `attachment; filename="SPL_${type}_report.csv"` }
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
        'Content-Disposition': `attachment; filename="SPL_${type}_report.csv"`
      }
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate report', details: error instanceof Error ? error.message : 'Unknown' }, { status: 500 })
  }
}
