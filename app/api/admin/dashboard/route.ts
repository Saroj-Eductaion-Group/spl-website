import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdminToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  if (!verifyAdminToken(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const [totalTeams, pendingTeams, approvedTeams, totalPlayers, individualPlayers, totalPayments, completedPayments] = await Promise.all([
      prisma.team.count(),
      prisma.team.count({ where: { status: 'PENDING' } }),
      prisma.team.count({ where: { status: 'APPROVED' } }),
      prisma.player.count(),
      prisma.player.count({ where: { isIndividual: true } }),
      prisma.payment.count(),
      prisma.payment.count({ where: { status: 'COMPLETED' } })
    ])
    const rejectedTeams = await prisma.team.count({ where: { status: 'REJECTED' } })
    return NextResponse.json({ totalTeams, pendingTeams, pendingApprovals: pendingTeams, approvedTeams, rejectedTeams, totalPlayers, individualPlayers, totalPayments, completedPayments })
  } catch {
    return NextResponse.json({ error: 'Failed to load dashboard' }, { status: 500 })
  }
}
