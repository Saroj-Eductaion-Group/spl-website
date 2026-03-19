import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyCoordinatorToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  if (!verifyCoordinatorToken(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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
