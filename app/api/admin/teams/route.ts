import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdminToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  if (!verifyAdminToken(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const teams = await prisma.team.findMany({
      include: {
        _count: { select: { players: true } }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(teams)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load teams' }, { status: 500 })
  }
}