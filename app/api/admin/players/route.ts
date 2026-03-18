import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdminToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  if (!verifyAdminToken(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const players = await prisma.player.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(players)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load players' }, { status: 500 })
  }
}