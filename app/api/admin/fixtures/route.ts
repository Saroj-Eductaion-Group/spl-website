import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendMatchNotificationEmail } from '@/lib/email'
import { verifyAdminToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  if (!verifyAdminToken(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const matches = await prisma.match.findMany({
      include: {
        team1: { select: { id: true, name: true, district: true, contactEmail: true } },
        team2: { select: { id: true, name: true, district: true, contactEmail: true } }
      },
      orderBy: { date: 'asc' }
    })
    return NextResponse.json(matches)
  } catch {
    return NextResponse.json({ error: 'Failed to load fixtures' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (!verifyAdminToken(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { team1Id, team2Id, venue, date, phase, notify } = await request.json()
    const match = await prisma.match.create({
      data: { team1Id, team2Id: team2Id || null, venue, date: new Date(date), phase: phase || 'DISTRICT' },
      include: {
        team1: { select: { id: true, name: true, district: true, contactEmail: true } },
        team2: { select: { id: true, name: true, district: true, contactEmail: true } }
      }
    })
    if (notify) {
      const dateStr = new Date(date).toLocaleString('en-IN')
      try {
        if (match.team1.contactEmail) await sendMatchNotificationEmail(match.team1.contactEmail, match.team1.name, match.team2?.name || 'TBD', venue, dateStr)
        if (match.team2?.contactEmail) await sendMatchNotificationEmail(match.team2.contactEmail, match.team2.name, match.team1.name, venue, dateStr)
      } catch (e) { console.error('Match notification email failed:', e) }
    }
    return NextResponse.json({ success: true, match })
  } catch {
    return NextResponse.json({ error: 'Failed to create fixture' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  if (!verifyAdminToken(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { matchId, result, winner, score1, score2 } = await request.json()
    await prisma.match.update({ where: { id: matchId }, data: { result, winner, score1, score2 } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to update fixture' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  if (!verifyAdminToken(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { matchId } = await request.json()
    await prisma.match.delete({ where: { id: matchId } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete fixture' }, { status: 500 })
  }
}
