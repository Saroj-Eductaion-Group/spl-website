import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdminToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  if (!verifyAdminToken(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { searchParams } = new URL(request.url)
    const district = searchParams.get('district')
    const type = searchParams.get('type') // 'individual' | 'team' | all

    const players = await prisma.player.findMany({
      where: {
        ...(district ? { district } : {}),
        ...(type === 'individual' ? { isIndividual: true } : {}),
        ...(type === 'team' ? { isIndividual: false } : {}),
      },
      include: {
        team: { select: { id: true, name: true, district: true } }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(players)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load players' }, { status: 500 })
  }
}
