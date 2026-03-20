import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAnyStaffToken } from '@/lib/auth'
import { sendTeamAssignmentEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  if (!verifyAnyStaffToken(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { playerId, teamId } = await request.json()
    const [player, team] = await Promise.all([
      prisma.player.findUnique({ where: { id: playerId } }),
      prisma.team.findUnique({ where: { id: teamId } })
    ])
    await prisma.player.update({
      where: { id: playerId },
      data: { teamId, teamAssigned: true }
    })
    // Send assignment notification email
    try {
      const dbUser = player?.createdById
        ? await prisma.user.findUnique({ where: { id: player.createdById }, select: { email: true } })
        : null
      if (dbUser?.email && player && team) {
        await sendTeamAssignmentEmail(
          dbUser.email, player.name, team.name, team.district,
          team.managerName || undefined, team.managerPhone || undefined,
          team.coachName || undefined, team.coachPhone || undefined,
          team.contactEmail || undefined
        )
      }
    } catch { }
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to assign player' }, { status: 500 })
  }
}
