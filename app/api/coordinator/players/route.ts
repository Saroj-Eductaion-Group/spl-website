import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyCoordinatorToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  if (!verifyCoordinatorToken(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { searchParams } = new URL(request.url)
    const district = searchParams.get('district')
    const players = await prisma.player.findMany({
      where: {
        isIndividual: true,
        teamAssigned: false,
        ...(district ? { district } : {})
      },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(players)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load players' }, { status: 500 })
  }
}
