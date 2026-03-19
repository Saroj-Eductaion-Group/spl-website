import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdminToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  if (!verifyAdminToken(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const [totalTeams, pendingTeams, approvedTeams, rejectedTeams, totalPlayers, individualPlayers, revenueAgg] = await Promise.all([
      prisma.team.count(),
      prisma.team.count({ where: { status: 'PENDING' } }),
      prisma.team.count({ where: { status: 'APPROVED' } }),
      prisma.team.count({ where: { status: 'REJECTED' } }),
      prisma.player.count(),
      prisma.player.count({ where: { isIndividual: true } }),
      prisma.payment.aggregate({ where: { status: 'COMPLETED' }, _sum: { amount: true } })
    ])
    const totalPayments = revenueAgg._sum.amount || 0
    return NextResponse.json({ totalTeams, pendingApprovals: pendingTeams, approvedTeams, rejectedTeams, totalPlayers, individualPlayers, totalPayments })
  } catch {
    return NextResponse.json({ error: 'Failed to load dashboard' }, { status: 500 })
  }
}
