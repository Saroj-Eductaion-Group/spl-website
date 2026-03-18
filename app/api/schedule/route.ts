import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const matches = await prisma.match.findMany({
      include: {
        team1: { select: { name: true, district: true } },
        team2: { select: { name: true, district: true } }
      },
      orderBy: { date: 'asc' }
    })
    return NextResponse.json(matches)
  } catch {
    return NextResponse.json({ error: 'Failed to load schedule' }, { status: 500 })
  }
}
