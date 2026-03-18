import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { playerId, teamId } = await request.json()
    await prisma.player.update({
      where: { id: playerId },
      data: { teamId, teamAssigned: true }
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to assign player' }, { status: 500 })
  }
}
