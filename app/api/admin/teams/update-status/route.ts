import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdminToken } from '@/lib/auth'
import { sendApprovalEmail, sendRejectionEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  if (!verifyAdminToken(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { teamId, status, reason } = await request.json()
    if (!teamId || !status) return NextResponse.json({ error: 'teamId and status are required' }, { status: 400 })

    const team = await prisma.team.update({ where: { id: teamId }, data: { status } })

    if (team.contactEmail) {
      try {
        if (status === 'APPROVED') await sendApprovalEmail(team.contactEmail, team.name, team.registrationId)
        else if (status === 'REJECTED') await sendRejectionEmail(team.contactEmail, team.name, team.registrationId, reason)
      } catch (e) { console.error('Email notification failed:', e) }
    }

    return NextResponse.json({ success: true, team })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update team status' }, { status: 500 })
  }
}
