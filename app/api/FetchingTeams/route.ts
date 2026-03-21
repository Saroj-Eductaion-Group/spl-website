import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Only fetch APPROVED teams, and include players
    const teams = await prisma.team.findMany({
      where: { status: 'APPROVED' },
      include: {
        players: true,  // Include all players for these teams
      },
    })
    return NextResponse.json(teams)
  } catch (error) {
    console.error('Error fetching public teams:', error)
    return NextResponse.json({ error: 'Failed to fetch teams' }, { status: 500 })
  }
}