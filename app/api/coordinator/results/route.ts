import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const district = searchParams.get('district')
    const matches = await prisma.match.findMany({
      include: {
        team1: { select: { id: true, name: true, district: true } },
        team2: { select: { id: true, name: true, district: true } }
      },
      where: district ? {
        OR: [{ team1: { district } }, { team2: { district } }]
      } : {},
      orderBy: { date: 'asc' }
    })
    return NextResponse.json(matches)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load matches' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { matchId, result, winner, score1, score2 } = await request.json()
    await prisma.match.update({
      where: { id: matchId },
      data: { result, winner, score1, score2 }
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update result' }, { status: 500 })
  }
}
